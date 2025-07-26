-- Quick fix for missing tables - run this in Supabase SQL Editor
-- This adds the missing tables that are causing 406 errors

-- ========================================
-- STEP 1: CREATE MISSING TABLES
-- ========================================

-- Create user_follows table
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id),
    UNIQUE(follower_id, following_id)
);

-- Create rule_downloads table
CREATE TABLE IF NOT EXISTS rule_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES cursor_rules(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rule_id, user_id)
);

-- Create rule_likes table
CREATE TABLE IF NOT EXISTS rule_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES cursor_rules(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(rule_id, user_id)
);

-- ========================================
-- STEP 2: CREATE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_rule_downloads_rule_id ON rule_downloads(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_downloads_user_id ON rule_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_rule_likes_rule_id ON rule_likes(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_likes_user_id ON rule_likes(user_id);

-- ========================================
-- STEP 3: ENABLE RLS
-- ========================================

ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_likes ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 4: CREATE POLICIES
-- ========================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own follows" ON user_follows;
DROP POLICY IF EXISTS "Users can manage their own follows" ON user_follows;
DROP POLICY IF EXISTS "Public read access" ON rule_downloads;
DROP POLICY IF EXISTS "Authenticated users can create" ON rule_downloads;
DROP POLICY IF EXISTS "Public read access" ON rule_likes;
DROP POLICY IF EXISTS "Authenticated users can create" ON rule_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON rule_likes;

-- Create policies
CREATE POLICY "Users can view their own follows" ON user_follows
    FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can manage their own follows" ON user_follows
    FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Public read access" ON rule_downloads
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create" ON rule_downloads
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public read access" ON rule_likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create" ON rule_likes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own likes" ON rule_likes
    FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- STEP 5: CREATE FUNCTIONS
-- ========================================

-- Create trigger functions for count updates
CREATE OR REPLACE FUNCTION update_rule_download_count()
RETURNS TRIGGER AS $func$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE cursor_rules SET downloads = downloads + 1 WHERE id = NEW.rule_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE cursor_rules SET downloads = downloads - 1 WHERE id = OLD.rule_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$func$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_rule_like_count()
RETURNS TRIGGER AS $func$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE cursor_rules SET likes = likes + 1 WHERE id = NEW.rule_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE cursor_rules SET likes = likes - 1 WHERE id = OLD.rule_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$func$ LANGUAGE plpgsql;

-- Create user stats function
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_rules BIGINT,
    total_downloads BIGINT,
    total_likes BIGINT,
    followers_count BIGINT,
    following_count BIGINT
) AS $func$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(COUNT(DISTINCT cr.id), 0) as total_rules,
        COALESCE(SUM(cr.downloads), 0) as total_downloads,
        COALESCE(SUM(cr.likes), 0) as total_likes,
        COALESCE(COUNT(DISTINCT uf_followers.id), 0) as followers_count,
        COALESCE(COUNT(DISTINCT uf_following.id), 0) as following_count
    FROM auth.users u
    LEFT JOIN cursor_rules cr ON u.id = cr.created_by
    LEFT JOIN user_follows uf_followers ON u.id = uf_followers.following_id
    LEFT JOIN user_follows uf_following ON u.id = uf_following.follower_id
    WHERE u.id = user_uuid
    GROUP BY u.id;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 6: CREATE TRIGGERS
-- ========================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_rule_download_count_trigger ON rule_downloads;
DROP TRIGGER IF EXISTS update_rule_like_count_trigger ON rule_likes;

-- Create triggers
CREATE TRIGGER update_rule_download_count_trigger
    AFTER INSERT OR DELETE ON rule_downloads
    FOR EACH ROW
    EXECUTE FUNCTION update_rule_download_count();

CREATE TRIGGER update_rule_like_count_trigger
    AFTER INSERT OR DELETE ON rule_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_rule_like_count();

-- ========================================
-- STEP 7: UPDATE USER PROFILE
-- ========================================

-- Update the user profile to remove the default bio
DO $$ 
DECLARE
    user_count INTEGER;
    first_user_id UUID;
BEGIN
    SELECT COUNT(*) INTO user_count FROM auth.users;
    SELECT id INTO first_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;
    
    IF user_count > 0 THEN
        UPDATE user_profiles 
        SET bio = '' 
        WHERE user_id = first_user_id 
        AND bio = 'Cursor Rules creator and developer. I love creating helpful coding rules for the community!';
        
        RAISE NOTICE 'Updated user profile bio';
    END IF;
END $$;

-- ========================================
-- STEP 8: SHOW RESULTS
-- ========================================

SELECT '=== MISSING TABLES FIXED ===' as info;
SELECT 'All missing tables created successfully!' as message;

SELECT '=== TABLE STATUS ===' as info;
SELECT 
    'user_follows' as table_name,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_follows') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'rule_downloads' as table_name,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rule_downloads') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'rule_likes' as table_name,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rule_likes') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

SELECT '=== FIX COMPLETE ===' as info; 