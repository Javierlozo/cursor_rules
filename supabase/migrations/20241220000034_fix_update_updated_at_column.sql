-- ========================================
-- MIGRATION: Fix update_updated_at_column Function
-- ========================================
-- This migration fixes the security warning for update_updated_at_column function

-- ========================================
-- STEP 1: FIX update_updated_at_column FUNCTION
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ========================================
-- STEP 2: VERIFICATION
-- ========================================

SELECT '=== UPDATE_UPDATED_AT_COLUMN FUNCTION FIXED ===' as info; 