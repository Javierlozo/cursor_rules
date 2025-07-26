-- Make current user an admin
-- Run this in Supabase SQL Editor

-- First, let's see what users exist
SELECT '=== CURRENT USERS ===' as info;
SELECT 
    id,
    email,
    user_metadata,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- Update the most recent user to have admin role
DO $$ 
DECLARE
    latest_user_id UUID;
    latest_user_email TEXT;
BEGIN
    -- Get the most recent user
    SELECT id, email INTO latest_user_id, latest_user_email 
    FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    IF latest_user_id IS NOT NULL THEN
        -- Update user metadata to include admin role
        UPDATE auth.users 
        SET user_metadata = jsonb_set(
            COALESCE(user_metadata, '{}'::jsonb),
            '{role}',
            '"admin"'
        )
        WHERE id = latest_user_id;
        
        RAISE NOTICE '✅ Made user % (ID: %) an admin', latest_user_email, latest_user_id;
    ELSE
        RAISE NOTICE '❌ No users found';
    END IF;
END $$;

-- Show updated users
SELECT '=== UPDATED USERS ===' as info;
SELECT 
    id,
    email,
    user_metadata,
    created_at
FROM auth.users
ORDER BY created_at DESC; 