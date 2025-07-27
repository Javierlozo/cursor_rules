-- ========================================
-- MIGRATION: Consolidated Cleanup
-- ========================================
-- This migration consolidates fixes from previous migrations:
-- - Fix view security
-- - Remove downloads functionality
-- - Fix get_user_stats function
-- - Fix notifications constraint
-- - Disable follow notification trigger

-- ========================================
-- STEP 1: FIX VIEW SECURITY
-- ========================================

-- Drop the existing view
DROP VIEW IF EXISTS cursor_rules_with_creator;

-- Recreate the view (defaults to SECURITY INVOKER)
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
    cr.likes,
    cr.created_by,
    cr.created_at,
    cr.updated_at,
    up.username as creator_username,
    up.display_name as creator_display_name
FROM cursor_rules cr
LEFT JOIN user_profiles up ON cr.created_by = up.user_id;

-- ========================================
-- STEP 2: REMOVE DOWNLOADS FUNCTIONALITY
-- ========================================

-- Drop the rule_downloads table (removes indexes and policies automatically)
DROP TABLE IF EXISTS rule_downloads CASCADE;

-- Remove the downloads column from cursor_rules
ALTER TABLE IF EXISTS cursor_rules DROP COLUMN IF EXISTS downloads;

-- Drop the update_rule_download_count function
DROP FUNCTION IF EXISTS update_rule_download_count();

-- ========================================
-- STEP 3: FIX GET_USER_STATS FUNCTION
-- ========================================

-- Drop the existing function
DROP FUNCTION IF EXISTS get_user_stats(UUID);

-- Create the updated get_user_stats function without downloads
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_rules BIGINT,
    total_likes BIGINT,
    followers_count BIGINT,
    following_count BIGINT
) AS $func$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(COUNT(DISTINCT cr.id), 0) as total_rules,
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
-- STEP 4: FIX NOTIFICATIONS CONSTRAINT
-- ========================================

-- Check what notification types exist in the database
DO $$
DECLARE
    notification_types TEXT[];
    valid_types TEXT := '';
    type_record RECORD;
BEGIN
    -- Get all distinct notification types
    SELECT array_agg(DISTINCT type) INTO notification_types FROM notifications;
    RAISE NOTICE 'Existing notification types: %', notification_types;
    
    -- Build valid types string (excluding 'download')
    FOR type_record IN SELECT DISTINCT type FROM notifications WHERE type != 'download'
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
    
    -- Add new constraint with only existing types (excluding 'download')
    IF valid_types != '' THEN
        EXECUTE 'ALTER TABLE notifications ADD CONSTRAINT valid_notification_type CHECK (type IN (' || valid_types || '))';
    END IF;
END $$;

-- Delete existing notifications with 'download' type
DELETE FROM notifications WHERE type = 'download';

-- ========================================
-- STEP 5: DISABLE FOLLOW NOTIFICATION TRIGGER
-- ========================================

-- Disable the trigger that's causing the 400 error
DROP TRIGGER IF EXISTS create_follow_notification_trigger ON user_follows;

-- ========================================
-- VERIFICATION
-- ========================================

SELECT '=== CONSOLIDATED CLEANUP COMPLETED ===' as info; 