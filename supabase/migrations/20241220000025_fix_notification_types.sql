-- ========================================
-- MIGRATION: Fix Notification Types Constraint
-- ========================================
-- This migration fixes the notification types constraint to include all valid types

-- ========================================
-- STEP 1: CLEAN UP INVALID NOTIFICATIONS
-- ========================================

-- Delete notifications with invalid types
DELETE FROM notifications WHERE type NOT IN ('follow', 'comment', 'mention', 'system');

-- ========================================
-- STEP 2: FIX NOTIFICATIONS CONSTRAINT
-- ========================================

-- Drop existing constraint
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS valid_notification_type;

-- Add new constraint with all valid notification types
ALTER TABLE notifications ADD CONSTRAINT valid_notification_type 
CHECK (type IN ('follow', 'comment', 'mention', 'system'));

-- ========================================
-- STEP 3: VERIFICATION
-- ========================================

SELECT '=== NOTIFICATION TYPES FIXED ===' as info; 