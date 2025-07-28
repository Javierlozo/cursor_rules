-- ========================================
-- MIGRATION: Fix get_user_stats Function
-- ========================================
-- This migration fixes the get_user_stats function to work with current schema

-- ========================================
-- STEP 1: DROP EXISTING FUNCTION
-- ========================================

DROP FUNCTION IF EXISTS get_user_stats(UUID);

-- ========================================
-- STEP 2: CREATE FIXED FUNCTION
-- ========================================

CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_rules BIGINT,
    total_downloads BIGINT,
    total_likes BIGINT,
    followers_count BIGINT,
    following_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(COUNT(DISTINCT cr.id), 0) as total_rules,
        0 as total_downloads, -- downloads column was removed
        0 as total_likes, -- likes column was removed
        COALESCE(COUNT(DISTINCT uf_followers.id), 0) as followers_count,
        COALESCE(COUNT(DISTINCT uf_following.id), 0) as following_count
    FROM auth.users u
    LEFT JOIN cursor_rules cr ON u.id = cr.created_by
    LEFT JOIN user_follows uf_followers ON u.id = uf_followers.following_id
    LEFT JOIN user_follows uf_following ON u.id = uf_following.follower_id
    WHERE u.id = user_uuid
    GROUP BY u.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ========================================
-- STEP 3: VERIFICATION
-- ========================================

SELECT '=== GET_USER_STATS FUNCTION FIXED ===' as info; 