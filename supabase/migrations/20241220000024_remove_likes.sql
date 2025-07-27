-- ========================================
-- MIGRATION: Remove all like-related structures
-- ========================================

-- 1. Drop the rule_likes table (removes indexes and policies automatically)
DROP TABLE IF EXISTS rule_likes CASCADE;

-- 2. Drop the update_rule_like_count function and trigger
DROP FUNCTION IF EXISTS update_rule_like_count();

-- 3. Remove likes from any views (if present)
DROP VIEW IF EXISTS cursor_rules_with_likes;

-- 4. Drop the cursor_rules_with_creator view first (it depends on likes column)
DROP VIEW IF EXISTS cursor_rules_with_creator;

-- 5. Now remove the likes column from cursor_rules
ALTER TABLE IF EXISTS cursor_rules DROP COLUMN IF EXISTS likes;

-- 6. Recreate the cursor_rules_with_creator view without likes
CREATE OR REPLACE VIEW cursor_rules_with_creator AS
SELECT
    cr.id,
    cr.name,
    cr.description,
    cr.pattern,
    cr.rule_content,
    cr.category,
    cr.framework,
    cr.tags,
    cr.created_by,
    cr.created_at,
    cr.updated_at,
    up.username as creator_username,
    up.display_name as creator_display_name
FROM cursor_rules cr
LEFT JOIN user_profiles up ON cr.created_by = up.user_id;

-- 7. Update the get_user_stats function to remove likes
DROP FUNCTION IF EXISTS get_user_stats(UUID);
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_rules BIGINT,
    followers_count BIGINT,
    following_count BIGINT
) AS $func$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(COUNT(DISTINCT cr.id), 0) as total_rules,
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

-- 8. Remove 'like' from notifications constraint
DO $$
DECLARE
    notification_types TEXT[];
    valid_types TEXT := '';
    type_record RECORD;
BEGIN
    -- Get all distinct notification types
    SELECT array_agg(DISTINCT type) INTO notification_types FROM notifications;
    RAISE NOTICE 'Existing notification types: %', notification_types;
    
    -- Build valid types string (excluding 'like' and 'download')
    FOR type_record IN SELECT DISTINCT type FROM notifications WHERE type NOT IN ('like', 'download')
    LOOP
        IF valid_types = '' THEN
            valid_types := quote_literal(type_record.type);
        ELSE
            valid_types := valid_types || ', ' || quote_literal(type_record.type);
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Valid types for constraint: %', valid_types;
    
    -- Drop existing constraint
    ALTER TABLE notifications DROP CONSTRAINT IF EXISTS valid_notification_type;
    
    -- Add new constraint with only existing types (excluding 'like' and 'download')
    IF valid_types != '' THEN
        EXECUTE 'ALTER TABLE notifications ADD CONSTRAINT valid_notification_type CHECK (type IN (' || valid_types || '))';
    END IF;
END $$;

-- 9. Delete existing notifications with 'like' type
DELETE FROM notifications WHERE type = 'like';

-- ========================================
-- VERIFICATION
-- ========================================

SELECT '=== LIKES REMOVED ===' as info; 