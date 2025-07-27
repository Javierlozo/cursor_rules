-- Final setup migration - complete database setup
-- This migration creates all tables, functions, and policies in the correct order

-- ========================================
-- STEP 1: CREATE BASIC TABLES
-- ========================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cursor_rules table
CREATE TABLE IF NOT EXISTS cursor_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pattern VARCHAR(255),
    rule_content TEXT NOT NULL,
    category VARCHAR(100),
    framework VARCHAR(100),
    tags TEXT[],
    downloads INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
-- STEP 2: CREATE ADVANCED TABLES
-- ========================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    website VARCHAR(255),
    github_username VARCHAR(39),
    twitter_username VARCHAR(15),
    location VARCHAR(100),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]+$'),
    CONSTRAINT username_length CHECK (LENGTH(username) >= 3),
    CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id)
);

-- Create user_follows table
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id),
    UNIQUE(follower_id, following_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL DEFAULT 'system',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_notification_type CHECK (type IN ('follow', 'like', 'download', 'comment', 'mention', 'system'))
);

-- ========================================
-- STEP 3: CREATE INDEXES
-- ========================================

-- Basic table indexes
CREATE INDEX IF NOT EXISTS idx_cursor_rules_category ON cursor_rules(category);
CREATE INDEX IF NOT EXISTS idx_cursor_rules_framework ON cursor_rules(framework);
CREATE INDEX IF NOT EXISTS idx_cursor_rules_created_by ON cursor_rules(created_by);
CREATE INDEX IF NOT EXISTS idx_cursor_rules_created_at ON cursor_rules(created_at);
CREATE INDEX IF NOT EXISTS idx_rule_downloads_rule_id ON rule_downloads(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_downloads_user_id ON rule_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_rule_likes_rule_id ON rule_likes(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_likes_user_id ON rule_likes(user_id);

-- Advanced table indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_public ON user_profiles(is_public);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ========================================
-- STEP 4: ENABLE RLS
-- ========================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursor_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 5: CREATE POLICIES
-- ========================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access" ON categories;
DROP POLICY IF EXISTS "Public read access" ON cursor_rules;
DROP POLICY IF EXISTS "Authenticated users can create" ON cursor_rules;
DROP POLICY IF EXISTS "Users can update their own rules" ON cursor_rules;
DROP POLICY IF EXISTS "Users can delete their own rules" ON cursor_rules;
DROP POLICY IF EXISTS "Public read access" ON rule_downloads;
DROP POLICY IF EXISTS "Authenticated users can create" ON rule_downloads;
DROP POLICY IF EXISTS "Public read access" ON rule_likes;
DROP POLICY IF EXISTS "Authenticated users can create" ON rule_likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON rule_likes;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own follows" ON user_follows;
DROP POLICY IF EXISTS "Users can manage their own follows" ON user_follows;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;

-- Create policies
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON cursor_rules FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create" ON cursor_rules FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own rules" ON cursor_rules FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own rules" ON cursor_rules FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Public read access" ON rule_downloads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create" ON rule_downloads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public read access" ON rule_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create" ON rule_likes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete their own likes" ON rule_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own follows" ON user_follows FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);
CREATE POLICY "Users can manage their own follows" ON user_follows FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- ========================================
-- STEP 6: CREATE FUNCTIONS
-- ========================================

-- Create trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $func$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

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

-- Create notification functions
CREATE OR REPLACE FUNCTION get_unread_notification_count(user_uuid UUID)
RETURNS INTEGER AS $func$
BEGIN
    RETURN (
        SELECT COALESCE(COUNT(*), 0)
        FROM notifications
        WHERE user_id = user_uuid AND is_read = false
    );
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION mark_notifications_as_read(user_uuid UUID, notification_id UUID DEFAULT NULL)
RETURNS VOID AS $func$
BEGIN
    IF notification_id IS NULL THEN
        UPDATE notifications 
        SET is_read = true 
        WHERE user_id = user_uuid AND is_read = false;
    ELSE
        UPDATE notifications 
        SET is_read = true 
        WHERE id = notification_id AND user_id = user_uuid;
    END IF;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create follow notification function
CREATE OR REPLACE FUNCTION create_follow_notification()
RETURNS TRIGGER AS $func$
BEGIN
    INSERT INTO notifications (user_id, from_user_id, type, title, message, data)
    VALUES (
        NEW.following_id,
        NEW.follower_id,
        'follow',
        'New Follower',
        'Someone started following you!',
        jsonb_build_object(
            'follower_id', NEW.follower_id,
            'follower_username', (SELECT username FROM user_profiles WHERE user_id = NEW.follower_id),
            'follower_display_name', (SELECT display_name FROM user_profiles WHERE user_id = NEW.follower_id)
        )
    );
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- STEP 7: CREATE TRIGGERS
-- ========================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_cursor_rules_updated_at ON cursor_rules;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_rule_download_count_trigger ON rule_downloads;
DROP TRIGGER IF EXISTS update_rule_like_count_trigger ON rule_likes;
DROP TRIGGER IF EXISTS create_follow_notification_trigger ON user_follows;

-- Create triggers
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cursor_rules_updated_at
    BEFORE UPDATE ON cursor_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rule_download_count_trigger
    AFTER INSERT OR DELETE ON rule_downloads
    FOR EACH ROW
    EXECUTE FUNCTION update_rule_download_count();

CREATE TRIGGER update_rule_like_count_trigger
    AFTER INSERT OR DELETE ON rule_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_rule_like_count();

CREATE TRIGGER create_follow_notification_trigger
    AFTER INSERT ON user_follows
    FOR EACH ROW
    EXECUTE FUNCTION create_follow_notification();

-- ========================================
-- STEP 8: CREATE VIEW
-- ========================================

CREATE OR REPLACE VIEW cursor_rules_with_creator AS
SELECT 
    cr.*,
    up.username as creator_username,
    up.display_name as creator_display_name
FROM cursor_rules cr
LEFT JOIN user_profiles up ON cr.created_by = up.user_id;

-- ========================================
-- STEP 9: INSERT DEFAULT DATA
-- ========================================

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('React', 'React.js development rules'),
('TypeScript', 'TypeScript coding standards'),
('Next.js', 'Next.js framework rules'),
('Tailwind CSS', 'Tailwind CSS styling rules'),
('Database', 'Database and SQL rules'),
('General', 'General coding rules and patterns')
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- STEP 10: CREATE USER PROFILE
-- ========================================

-- Create a profile for the current user
DO $$ 
DECLARE
    user_count INTEGER;
    first_user_id UUID;
    first_user_email TEXT;
BEGIN
    -- Count users
    SELECT COUNT(*) INTO user_count FROM auth.users;
    
    -- Get first user ID if any exist
    SELECT id, email INTO first_user_id, first_user_email FROM auth.users ORDER BY created_at DESC LIMIT 1;
    
    IF user_count = 0 THEN
        RAISE NOTICE 'No users found. Please create a user account first.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found % users. Using user ID: % (Email: %)', user_count, first_user_id, first_user_email;
    
    -- Create a user profile (only if username doesn't exist)
    INSERT INTO user_profiles (user_id, username, display_name, bio, is_public) 
    SELECT 
        first_user_id, 
        'luisloart', 
        'Luis', 
        '',
        true
    WHERE NOT EXISTS (
        SELECT 1 FROM user_profiles WHERE username = 'luisloart'
    );

    RAISE NOTICE 'User profile created/updated successfully!';
END $$;

-- ========================================
-- STEP 11: SHOW RESULTS
-- ========================================

SELECT '=== MIGRATION COMPLETE ===' as info;
SELECT 'All tables, functions, and policies created successfully!' as message;

SELECT '=== TABLE STATUS ===' as info;
SELECT 
    'cursor_rules' as table_name,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cursor_rules') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'user_profiles' as table_name,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
UNION ALL
SELECT 
    'notifications' as table_name,
    CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') 
         THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

SELECT '=== SAMPLE DATA ===' as info;
SELECT 'Categories:', COUNT(*) FROM categories
UNION ALL
SELECT 'Cursor rules:', COUNT(*) FROM cursor_rules
UNION ALL
SELECT 'User profiles:', COUNT(*) FROM user_profiles; 