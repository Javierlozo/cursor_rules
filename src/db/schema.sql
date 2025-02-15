-- Create cursor_rules table
CREATE TABLE cursor_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pattern VARCHAR(255), -- File pattern matching (e.g., "*.tsx")
    rule_content TEXT NOT NULL, -- The actual rule content
    references TEXT[], -- Array of referenced files
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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