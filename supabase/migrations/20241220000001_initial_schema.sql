-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cursor_rules table
CREATE TABLE cursor_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pattern VARCHAR(255), -- File pattern for rule application
    rule_content TEXT NOT NULL,
    file_references TEXT[], -- Array of referenced files
    tags TEXT[], -- Array of tags
    category VARCHAR(100),
    framework VARCHAR(100),
    downloads INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    cursor_properties JSONB DEFAULT '{"color": "#3B82F6", "size": "medium", "shape": "default"}'::jsonb
);

-- Create rule_downloads table for tracking downloads
CREATE TABLE rule_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_id UUID REFERENCES cursor_rules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create rule_likes table for tracking likes
CREATE TABLE rule_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_id UUID REFERENCES cursor_rules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(rule_id, user_id) -- Prevent duplicate likes
);

-- Create categories table for predefined categories
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_cursor_rules_created_by ON cursor_rules(created_by);
CREATE INDEX idx_cursor_rules_category ON cursor_rules(category);
CREATE INDEX idx_cursor_rules_framework ON cursor_rules(framework);
CREATE INDEX idx_cursor_rules_created_at ON cursor_rules(created_at DESC);
CREATE INDEX idx_cursor_rules_downloads ON cursor_rules(downloads DESC);
CREATE INDEX idx_cursor_rules_likes ON cursor_rules(likes DESC);
CREATE INDEX idx_cursor_rules_tags ON cursor_rules USING GIN(tags);
CREATE INDEX idx_rule_downloads_rule_id ON rule_downloads(rule_id);
CREATE INDEX idx_rule_downloads_user_id ON rule_downloads(user_id);
CREATE INDEX idx_rule_likes_rule_id ON rule_likes(rule_id);
CREATE INDEX idx_rule_likes_user_id ON rule_likes(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_cursor_rules_updated_at 
    BEFORE UPDATE ON cursor_rules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to update download count
CREATE OR REPLACE FUNCTION update_rule_download_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE cursor_rules 
        SET downloads = downloads + 1 
        WHERE id = NEW.rule_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE cursor_rules 
        SET downloads = downloads - 1 
        WHERE id = OLD.rule_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for download count
CREATE TRIGGER update_rule_download_count_trigger
    AFTER INSERT OR DELETE ON rule_downloads
    FOR EACH ROW
    EXECUTE FUNCTION update_rule_download_count();

-- Create function to update like count
CREATE OR REPLACE FUNCTION update_rule_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE cursor_rules 
        SET likes = likes + 1 
        WHERE id = NEW.rule_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE cursor_rules 
        SET likes = likes - 1 
        WHERE id = OLD.rule_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for like count
CREATE TRIGGER update_rule_like_count_trigger
    AFTER INSERT OR DELETE ON rule_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_rule_like_count();

-- Enable Row Level Security (RLS)
ALTER TABLE cursor_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cursor_rules
CREATE POLICY "Public read access" ON cursor_rules
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create" ON cursor_rules
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own rules" ON cursor_rules
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own rules" ON cursor_rules
    FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for rule_downloads
CREATE POLICY "Public read access" ON rule_downloads
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create" ON rule_downloads
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for rule_likes
CREATE POLICY "Public read access" ON rule_likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create" ON rule_likes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own likes" ON rule_likes
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for categories
CREATE POLICY "Public read access" ON categories
    FOR SELECT USING (true); 