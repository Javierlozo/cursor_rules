# Database Scripts

This directory contains SQL scripts for setting up and managing the Cursor Rules Hub database.

## 📁 Files

### Core Setup Scripts

- **`create-test-data.sql`** - Inserts sample data for testing
- **`deploy.sh`** - Deployment script for the application
- **`make-admin.sql`** - Makes current user an admin
- **`final-cleanup.sql`** - Verifies database setup

### Migration Files

- **`supabase/migrations/20241220000017_final_setup.sql`** - Complete database setup with all features

## 🚀 Quick Start

1. **Run the complete setup:**
   ```sql
   -- Copy and paste supabase/migrations/20241220000017_final_setup.sql into Supabase SQL Editor
   ```

2. **Make yourself an admin (optional):**
   ```sql
   -- Copy and paste scripts/make-admin.sql into Supabase SQL Editor
   ```

3. **Add test data (optional):**
   ```sql
   -- Copy and paste scripts/create-test-data.sql into Supabase SQL Editor
   ```

4. **Verify setup (optional):**
   ```sql
   -- Copy and paste scripts/final-cleanup.sql into Supabase SQL Editor
   ```

## 📋 What Gets Created

### Tables
- `categories` - Rule categories
- `cursor_rules` - The main rules table
- `user_profiles` - User public profiles
- `notifications` - User notifications
- `rule_downloads` - Download tracking
- `rule_likes` - Like tracking
- `user_follows` - Follow relationships

### Features
- ✅ Row Level Security (RLS)
- ✅ User authentication
- ✅ Public profiles
- ✅ Notifications system
- ✅ Social features (follows)
- ✅ Download/like tracking
- ✅ Admin dashboard

## 🔧 Troubleshooting

If you encounter errors:

1. **Check if tables exist:**
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```

2. **Check constraints:**
   ```sql
   SELECT constraint_name, constraint_type FROM information_schema.table_constraints WHERE table_name = 'user_profiles';
   ```

3. **Run the final migration** which handles all edge cases and missing columns.

## 📝 Notes

- All scripts use `IF NOT EXISTS` to avoid conflicts
- Policies are dropped and recreated to ensure consistency
- User profiles are created automatically for existing users
- The final migration includes all advanced features 