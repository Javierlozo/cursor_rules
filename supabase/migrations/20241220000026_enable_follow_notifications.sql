-- ========================================
-- MIGRATION: Enable Follow Notifications
-- ========================================
-- This migration re-enables the follow notification trigger

-- ========================================
-- STEP 1: RE-ENABLE FOLLOW NOTIFICATION TRIGGER
-- ========================================

-- Re-enable the follow notification trigger
CREATE TRIGGER create_follow_notification_trigger
    AFTER INSERT ON user_follows
    FOR EACH ROW
    EXECUTE FUNCTION create_follow_notification();

-- ========================================
-- STEP 2: VERIFICATION
-- ========================================

SELECT '=== FOLLOW NOTIFICATIONS ENABLED ===' as info; 