-- Create basic tables that are needed for the application
-- This migration creates the core tables that other features depend on
-- SAFE VERSION - handles existing policies

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cursor_rules table if it doesn't exist
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cursor_rules_category ON cursor_rules(category);
CREATE INDEX IF NOT EXISTS idx_cursor_rules_framework ON cursor_rules(framework);
CREATE INDEX IF NOT EXISTS idx_cursor_rules_created_by ON cursor_rules(created_by);
CREATE INDEX IF NOT EXISTS idx_cursor_rules_created_at ON cursor_rules(created_at);
CREATE INDEX IF NOT EXISTS idx_rule_downloads_rule_id ON rule_downloads(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_downloads_user_id ON rule_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_rule_likes_rule_id ON rule_likes(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_likes_user_id ON rule_likes(user_id);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursor_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid conflicts
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

-- Create RLS policies
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

-- Create trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $func$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_cursor_rules_updated_at ON cursor_rules;

-- Create triggers
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cursor_rules_updated_at
    BEFORE UPDATE ON cursor_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create functions for updating counts
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

-- Drop existing triggers first
DROP TRIGGER IF EXISTS update_rule_download_count_trigger ON rule_downloads;
DROP TRIGGER IF EXISTS update_rule_like_count_trigger ON rule_likes;

-- Create triggers for count updates
CREATE TRIGGER update_rule_download_count_trigger
    AFTER INSERT OR DELETE ON rule_downloads
    FOR EACH ROW
    EXECUTE FUNCTION update_rule_download_count();

CREATE TRIGGER update_rule_like_count_trigger
    AFTER INSERT OR DELETE ON rule_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_rule_like_count();

-- Add comments
COMMENT ON TABLE categories IS 'Predefined categories for organizing rules';
COMMENT ON TABLE cursor_rules IS 'Cursor rules created by users';
COMMENT ON TABLE rule_downloads IS 'Track rule downloads by users';
COMMENT ON TABLE rule_likes IS 'Track rule likes by users';

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('React', 'React.js development rules'),
('TypeScript', 'TypeScript coding standards'),
('Next.js', 'Next.js framework rules'),
('Tailwind CSS', 'Tailwind CSS styling rules'),
('Database', 'Database and SQL rules'),
('General', 'General coding rules and patterns')
ON CONFLICT (name) DO NOTHING; 