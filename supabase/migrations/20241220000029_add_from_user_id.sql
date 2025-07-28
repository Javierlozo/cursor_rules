-- ========================================
-- MIGRATION: Add from_user_id to notifications
-- ========================================
-- This migration adds the missing from_user_id column to notifications table

-- ========================================
-- STEP 1: ADD MISSING COLUMN
-- ========================================

-- Add from_user_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' 
        AND column_name = 'from_user_id'
    ) THEN
        ALTER TABLE notifications ADD COLUMN from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- ========================================
-- STEP 2: VERIFICATION
-- ========================================

SELECT '=== FROM_USER_ID COLUMN ADDED ===' as info; 