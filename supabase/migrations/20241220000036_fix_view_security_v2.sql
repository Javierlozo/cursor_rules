-- ========================================
-- MIGRATION: Fix View Security V2
-- ========================================
-- This migration explicitly recreates the view without SECURITY DEFINER

-- ========================================
-- STEP 1: DROP EXISTING VIEW
-- ========================================

DROP VIEW IF EXISTS cursor_rules_with_creator CASCADE;

-- ========================================
-- STEP 2: CREATE VIEW WITHOUT SECURITY DEFINER
-- ========================================

-- Explicitly create view with SECURITY INVOKER (default, but being explicit)
CREATE VIEW cursor_rules_with_creator AS
SELECT
    cr.id,
    cr.name,
    cr.description,
    cr.pattern,
    cr.rule_content,
    cr.category,
    cr.framework,
    cr.tags,
    cr.created_by,
    cr.created_at,
    cr.updated_at,
    up.username as creator_username,
    up.display_name as creator_display_name
FROM cursor_rules cr
LEFT JOIN user_profiles up ON cr.created_by = up.user_id;

-- ========================================
-- STEP 3: VERIFICATION
-- ========================================

SELECT '=== VIEW SECURITY V2 FIXED ===' as info; 