#!/bin/bash

echo "🚀 Cursor Rules Hub - Database Migration Runner"
echo "================================================"
echo ""

echo "📋 This will set up your database with all features:"
echo "   • Core tables (categories, cursor_rules, etc.)"
echo "   • Social features (user profiles, following)"
echo "   • Notifications system"
echo "   • All security policies and functions"
echo ""

read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "✅ Running migrations..."
    echo ""
    echo "📝 Step 1: Basic Tables"
    echo "   Copy and paste this file into your Supabase SQL Editor:"
    echo "   📁 supabase/migrations/20241220000016_create_basic_tables_safe.sql"
    echo ""
    echo "📝 Step 2: Advanced Features"
    echo "   Copy and paste this file into your Supabase SQL Editor:"
    echo "   📁 supabase/migrations/20241220000014_handle_existing_tables.sql"
    echo ""
    echo "🔗 Supabase Dashboard: https://supabase.com/dashboard"
    echo ""
    echo "✅ After running both migrations, your app will have:"
    echo "   • Complete database setup"
    echo "   • All social features working"
    echo "   • Notifications system"
    echo "   • Creator information on rules"
    echo "   • All security policies"
    echo ""
    echo "🎉 Migration complete! Your app should work perfectly now."
else
    echo "❌ Migration cancelled."
fi 