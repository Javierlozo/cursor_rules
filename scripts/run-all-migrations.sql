-- Complete migration runner - run this in Supabase SQL Editor
-- This script runs the final setup migration

-- ========================================
-- STEP 1: RUN THE FINAL SETUP MIGRATION
-- ========================================

-- This will create all tables, functions, and policies
-- The migration is in: supabase/migrations/20241220000017_final_setup.sql

-- You can either:
-- 1. Copy and paste the content of 20241220000017_final_setup.sql here
-- 2. Or run it directly from the migrations folder

-- For now, let's run the essential parts:

-- Create basic tables
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create user_profiles table with proper constraints
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

-- Create notifications table with all required columns
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

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursor_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON cursor_rules FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create" ON cursor_rules FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own rules" ON cursor_rules FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('React', 'React.js development rules'),
('TypeScript', 'TypeScript coding standards'),
('Next.js', 'Next.js framework rules'),
('Tailwind CSS', 'Tailwind CSS styling rules'),
('Database', 'Database and SQL rules'),
('General', 'General coding rules and patterns')
ON CONFLICT (name) DO NOTHING;

-- Create user profile
DO $$ 
DECLARE
    user_count INTEGER;
    first_user_id UUID;
    first_user_email TEXT;
BEGIN
    SELECT COUNT(*) INTO user_count FROM auth.users;
    SELECT id, email INTO first_user_id, first_user_email FROM auth.users ORDER BY created_at DESC LIMIT 1;
    
    IF user_count > 0 THEN
        INSERT INTO user_profiles (user_id, username, display_name, bio, is_public) VALUES
        (first_user_id, 'luisloart', 'Luis', '', true)
        ON CONFLICT (user_id) DO UPDATE SET
            username = EXCLUDED.username,
            display_name = EXCLUDED.display_name,
            bio = EXCLUDED.bio,
            is_public = EXCLUDED.is_public;
        
        RAISE NOTICE 'User profile created/updated successfully!';
    END IF;
END $$;

-- Show results
SELECT '=== MIGRATION COMPLETE ===' as info;
SELECT 'Basic setup completed successfully!' as message;

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