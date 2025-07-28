-- ========================================
-- MIGRATION: Fix Function Security
-- ========================================
-- This migration fixes security warnings by setting explicit search_path

-- ========================================
-- STEP 1: FIX get_unread_notification_count FUNCTION
-- ========================================

CREATE OR REPLACE FUNCTION get_unread_notification_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COALESCE(COUNT(*), 0)
        FROM notifications
        WHERE user_id = user_uuid AND is_read = false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ========================================
-- STEP 2: FIX create_follow_notification FUNCTION
-- ========================================

CREATE OR REPLACE FUNCTION create_follow_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications (user_id, from_user_id, type, title, message, data)
    VALUES (
        NEW.following_id,
        NEW.follower_id,
        'follow',
        'New Follower',
        'Someone started following you!',
        jsonb_build_object(
            'follower_id', NEW.follower_id,
            'follower_username', (SELECT username FROM user_profiles WHERE user_id = NEW.follower_id),
            'follower_display_name', (SELECT display_name FROM user_profiles WHERE user_id = NEW.follower_id)
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ========================================
-- STEP 3: FIX mark_notifications_as_read FUNCTION
-- ========================================

CREATE OR REPLACE FUNCTION mark_notifications_as_read(user_uuid UUID, notification_id UUID DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    IF notification_id IS NULL THEN
        UPDATE notifications 
        SET is_read = true 
        WHERE user_id = user_uuid AND is_read = false;
    ELSE
        UPDATE notifications 
        SET is_read = true 
        WHERE id = notification_id AND user_id = user_uuid;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ========================================
-- STEP 4: VERIFICATION
-- ========================================

SELECT '=== FUNCTION SECURITY FIXED ===' as info; 