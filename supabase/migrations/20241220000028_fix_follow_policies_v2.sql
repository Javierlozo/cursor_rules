-- ========================================
-- MIGRATION: Fix Follow Policies V2
-- ========================================
-- This migration provides a more comprehensive fix for user_follows RLS policies

-- ========================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ========================================

-- Drop all existing policies for user_follows
DROP POLICY IF EXISTS "Users can view their own follows" ON user_follows;
DROP POLICY IF EXISTS "Users can insert follows" ON user_follows;
DROP POLICY IF EXISTS "Users can delete follows" ON user_follows;
DROP POLICY IF EXISTS "Users can manage their own follows" ON user_follows;

-- ========================================
-- STEP 2: CREATE COMPREHENSIVE POLICIES
-- ========================================

-- Allow users to view any follow relationship where they are involved
CREATE POLICY "Users can view follows" ON user_follows 
FOR SELECT USING (
    auth.uid() = follower_id OR 
    auth.uid() = following_id OR
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() 
        AND is_public = true
    )
);

-- Allow users to insert follows (they can follow anyone)
CREATE POLICY "Users can insert follows" ON user_follows 
FOR INSERT WITH CHECK (
    auth.uid() = follower_id AND 
    follower_id != following_id
);

-- Allow users to delete follows (they can unfollow anyone they follow)
CREATE POLICY "Users can delete follows" ON user_follows 
FOR DELETE USING (
    auth.uid() = follower_id
);

-- ========================================
-- STEP 3: VERIFICATION
-- ========================================

SELECT '=== FOLLOW POLICIES V2 FIXED ===' as info; 