-- ========================================
-- MIGRATION: Fix Follow Policies V4
-- ========================================
-- This migration creates a completely open RLS policy for user_follows

-- ========================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ========================================

-- Drop all existing policies for user_follows
DROP POLICY IF EXISTS "Users can view follows" ON user_follows;
DROP POLICY IF EXISTS "Users can insert follows" ON user_follows;
DROP POLICY IF EXISTS "Users can delete follows" ON user_follows;
DROP POLICY IF EXISTS "Users can manage their own follows" ON user_follows;

-- ========================================
-- STEP 2: CREATE OPEN POLICIES
-- ========================================

-- Allow all operations for authenticated users
CREATE POLICY "Open access for authenticated users" ON user_follows 
FOR ALL USING (
    auth.uid() IS NOT NULL
);

-- ========================================
-- STEP 3: VERIFICATION
-- ========================================

SELECT '=== FOLLOW POLICIES V4 FIXED ===' as info; 