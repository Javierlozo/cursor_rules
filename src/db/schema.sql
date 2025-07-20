-- Create cursor_rules table
CREATE TABLE cursor_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pattern VARCHAR(255), -- File pattern matching (e.g., "*.tsx")
    rule_content TEXT NOT NULL, -- The actual rule content
    file_references TEXT[], -- Array of referenced files
    tags TEXT[], -- Array of tags for categorization
    category VARCHAR(100), -- Main category (e.g., "React", "Node.js", "Testing")
    framework VARCHAR(100), -- Framework this rule is for
    downloads INTEGER DEFAULT 0, -- Number of times downloaded
    likes INTEGER DEFAULT 0, -- Number of likes
    created_by UUID,
    cursor_properties JSONB DEFAULT '{"color": "#3B82F6", "size": "medium", "shape": "default"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create users table for authentication
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create likes table for user interactions
CREATE TABLE rule_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_id UUID REFERENCES cursor_rules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(rule_id, user_id)
);

-- Create downloads tracking table
CREATE TABLE rule_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_id UUID REFERENCES cursor_rules(id) ON DELETE CASCADE,
    user_id UUID, -- Can be null for anonymous downloads
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default categories
INSERT INTO categories (name, description, color) VALUES
('React', 'Rules for React development', '#61DAFB'),
('Node.js', 'Rules for Node.js and Express development', '#339933'),
('TypeScript', 'Rules for TypeScript development', '#3178C6'),
('Testing', 'Rules for testing frameworks', '#FF6B6B'),
('UI/UX', 'Rules for UI/UX development', '#FF6B9D'),
('Performance', 'Rules for performance optimization', '#4ECDC4'),
('Security', 'Rules for security best practices', '#FFE66D'),
('Database', 'Rules for database operations', '#95E1D3'),
('API', 'Rules for API development', '#F38181'),
('General', 'General development rules', '#6C5CE7');

-- Create cursor_properties type validation
CREATE OR REPLACE FUNCTION check_cursor_properties()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT (
        NEW.cursor_properties ? 'color' AND
        NEW.cursor_properties ? 'size' AND
        NEW.cursor_properties ? 'shape'
    ) THEN
        RAISE EXCEPTION 'cursor_properties must contain color, size, and shape';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for validation
CREATE TRIGGER validate_cursor_properties
    BEFORE INSERT OR UPDATE ON cursor_rules
    FOR EACH ROW
    EXECUTE FUNCTION check_cursor_properties();

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cursor_rules_updated_at
    BEFORE UPDATE ON cursor_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_cursor_rules_category ON cursor_rules(category);
CREATE INDEX idx_cursor_rules_framework ON cursor_rules(framework);
CREATE INDEX idx_cursor_rules_tags ON cursor_rules USING GIN(tags);
CREATE INDEX idx_cursor_rules_downloads ON cursor_rules(downloads DESC);
CREATE INDEX idx_cursor_rules_likes ON cursor_rules(likes DESC);
CREATE INDEX idx_cursor_rules_created_at ON cursor_rules(created_at DESC); 