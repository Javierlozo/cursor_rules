-- Fix All Remaining Warnings Migration
-- This migration addresses all 5 warnings in Supabase

-- 1. Fix ALL function search_path issues
DO $$
BEGIN
    -- Drop triggers first (they depend on the functions)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cursor_rules') THEN
        DROP TRIGGER IF EXISTS update_cursor_rules_updated_at ON cursor_rules;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rule_downloads') THEN
        DROP TRIGGER IF EXISTS update_rule_download_count_trigger ON rule_downloads;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rule_likes') THEN
        DROP TRIGGER IF EXISTS update_rule_like_count_trigger ON rule_likes;
    END IF;
    
    -- Now drop and recreate ALL functions with proper search_path
    DROP FUNCTION IF EXISTS update_updated_at_column();
    DROP FUNCTION IF EXISTS update_rule_download_count();
    DROP FUNCTION IF EXISTS update_rule_like_count();
    
    -- Recreate update_updated_at_column with proper search_path
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
        NEW.updated_at = TIMEZONE('utc'::text, NOW());
        RETURN NEW;
    END;
    $func$ language 'plpgsql' SECURITY DEFINER SET search_path = public;
    
    -- Recreate update_rule_download_count with proper search_path
    CREATE OR REPLACE FUNCTION update_rule_download_count()
    RETURNS TRIGGER AS $func$
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
    $func$ language 'plpgsql' SECURITY DEFINER SET search_path = public;
    
    -- Recreate update_rule_like_count with proper search_path
    CREATE OR REPLACE FUNCTION update_rule_like_count()
    RETURNS TRIGGER AS $func$
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
    $func$ language 'plpgsql' SECURITY DEFINER SET search_path = public;
    
    -- Recreate triggers after functions exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cursor_rules') THEN
        CREATE TRIGGER update_cursor_rules_updated_at
            BEFORE UPDATE ON cursor_rules
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rule_downloads') THEN
        CREATE TRIGGER update_rule_download_count_trigger
            AFTER INSERT OR DELETE ON rule_downloads
            FOR EACH ROW
            EXECUTE FUNCTION update_rule_download_count();
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rule_likes') THEN
        CREATE TRIGGER update_rule_like_count_trigger
            AFTER INSERT OR DELETE ON rule_likes
            FOR EACH ROW
            EXECUTE FUNCTION update_rule_like_count();
    END IF;
END $$;

-- 2. Add comprehensive documentation
DO $$
BEGIN
    -- Add comments to tables that exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cursor_rules') THEN
        COMMENT ON TABLE cursor_rules IS 'Stores cursor rules created by users';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
        COMMENT ON TABLE categories IS 'Predefined categories for organizing rules';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rule_downloads') THEN
        COMMENT ON TABLE rule_downloads IS 'Tracks when users download rules';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rule_likes') THEN
        COMMENT ON TABLE rule_likes IS 'Tracks when users like rules';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
        COMMENT ON TABLE notifications IS 'User notifications and alerts';
    END IF;
    
    -- Add comments to cursor_rules columns
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cursor_rules') THEN
        COMMENT ON COLUMN cursor_rules.id IS 'Unique identifier for the rule';
        COMMENT ON COLUMN cursor_rules.name IS 'Name of the cursor rule';
        COMMENT ON COLUMN cursor_rules.description IS 'Description of what the rule does';
        COMMENT ON COLUMN cursor_rules.pattern IS 'File pattern where this rule applies (e.g., *.tsx)';
        COMMENT ON COLUMN cursor_rules.rule_content IS 'The actual rule content/instructions';
        COMMENT ON COLUMN cursor_rules.tags IS 'Array of tags for categorization';
        COMMENT ON COLUMN cursor_rules.category IS 'Category of the rule (e.g., React, API)';
        COMMENT ON COLUMN cursor_rules.framework IS 'Framework this rule is for (e.g., React, Node.js)';
        COMMENT ON COLUMN cursor_rules.downloads IS 'Number of times this rule has been downloaded';
        COMMENT ON COLUMN cursor_rules.likes IS 'Number of likes this rule has received';
        COMMENT ON COLUMN cursor_rules.created_by IS 'User who created this rule';
        COMMENT ON COLUMN cursor_rules.created_at IS 'When this rule was created';
        COMMENT ON COLUMN cursor_rules.updated_at IS 'When this rule was last updated';
        COMMENT ON COLUMN cursor_rules.cursor_properties IS 'JSON object with cursor-specific properties';
    END IF;
    
    -- Add comments to categories columns
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
        COMMENT ON COLUMN categories.id IS 'Unique identifier for the category';
        COMMENT ON COLUMN categories.name IS 'Name of the category';
        COMMENT ON COLUMN categories.description IS 'Description of the category';
        COMMENT ON COLUMN categories.color IS 'Hex color code for the category';
        COMMENT ON COLUMN categories.created_at IS 'When this category was created';
    END IF;
    
    -- Add comments to rule_downloads columns
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rule_downloads') THEN
        COMMENT ON COLUMN rule_downloads.id IS 'Unique identifier for the download record';
        COMMENT ON COLUMN rule_downloads.rule_id IS 'Reference to the downloaded rule';
        COMMENT ON COLUMN rule_downloads.user_id IS 'User who downloaded the rule';
        COMMENT ON COLUMN rule_downloads.downloaded_at IS 'When the rule was downloaded';
    END IF;
    
    -- Add comments to rule_likes columns
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rule_likes') THEN
        COMMENT ON COLUMN rule_likes.id IS 'Unique identifier for the like record';
        COMMENT ON COLUMN rule_likes.rule_id IS 'Reference to the liked rule';
        COMMENT ON COLUMN rule_likes.user_id IS 'User who liked the rule';
        COMMENT ON COLUMN rule_likes.created_at IS 'When the rule was liked';
    END IF;
END $$;

-- 3. Add missing constraints for data integrity
DO $$
BEGIN
    -- Add NOT NULL constraints where missing
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cursor_rules') THEN
        -- Add NOT NULL constraint to name if not exists
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cursor_rules' AND column_name = 'name' AND is_nullable = 'YES') THEN
            ALTER TABLE cursor_rules ALTER COLUMN name SET NOT NULL;
        END IF;
        
        -- Add NOT NULL constraint to rule_content if not exists
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cursor_rules' AND column_name = 'rule_content' AND is_nullable = 'YES') THEN
            ALTER TABLE cursor_rules ALTER COLUMN rule_content SET NOT NULL;
        END IF;
    END IF;
    
    -- Add NOT NULL constraint to categories.name if not exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'categories' AND column_name = 'name' AND is_nullable = 'YES') THEN
            ALTER TABLE categories ALTER COLUMN name SET NOT NULL;
        END IF;
    END IF;
    
    -- Add check constraints for data integrity
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cursor_rules') THEN
        -- Check constraint for downloads count
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cursor_rules' AND column_name = 'downloads') THEN
            IF NOT EXISTS (
                SELECT FROM information_schema.check_constraints 
                WHERE constraint_name = 'check_downloads_non_negative'
            ) THEN
                ALTER TABLE cursor_rules 
                ADD CONSTRAINT check_downloads_non_negative 
                CHECK (downloads >= 0);
            END IF;
        END IF;
        
        -- Check constraint for likes count
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cursor_rules' AND column_name = 'likes') THEN
            IF NOT EXISTS (
                SELECT FROM information_schema.check_constraints 
                WHERE constraint_name = 'check_likes_non_negative'
            ) THEN
                ALTER TABLE cursor_rules 
                ADD CONSTRAINT check_likes_non_negative 
                CHECK (likes >= 0);
            END IF;
        END IF;
    END IF;
END $$; 