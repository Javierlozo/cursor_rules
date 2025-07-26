-- Create test data for Cursor Rules Hub
-- Run this in your Supabase SQL Editor after the migration

-- First, let's check if we have any users
DO $$ 
DECLARE
    user_count INTEGER;
    first_user_id UUID;
BEGIN
    -- Count users
    SELECT COUNT(*) INTO user_count FROM auth.users;
    
    -- Get first user ID if any exist
    SELECT id INTO first_user_id FROM auth.users LIMIT 1;
    
    IF user_count = 0 THEN
        RAISE NOTICE 'No users found. Please create a user account first, then run this script again.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found % users. Using user ID: %', user_count, first_user_id;
    
    -- Insert sample cursor rules
    INSERT INTO cursor_rules (name, description, pattern, rule_content, category, framework, tags, downloads, likes, created_by) VALUES
    ('React Component Structure', 
     'Standard React component structure with TypeScript',
     'react-component',
     '// React component with TypeScript
import React from "react";

interface Props {
  // Define your props here
}

export const ComponentName: React.FC<Props> = ({ /* props */ }) => {
  return (
    <div>
      {/* Your component content */}
    </div>
  );
};',
     'React',
     'React',
     ARRAY['react', 'typescript', 'component'],
     0,
     0,
     first_user_id
    ) ON CONFLICT DO NOTHING;

    -- Sample rule 2
    INSERT INTO cursor_rules (name, description, pattern, rule_content, category, framework, tags, downloads, likes, created_by) VALUES
    ('Next.js API Route', 
     'Standard Next.js API route structure',
     'next-api-route',
     '// Next.js API route
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Your API logic here
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}',
     'Next.js',
     'Next.js',
     ARRAY['nextjs', 'api', 'typescript'],
     0,
     0,
     first_user_id
    ) ON CONFLICT DO NOTHING;

    -- Sample rule 3
    INSERT INTO cursor_rules (name, description, pattern, rule_content, category, framework, tags, downloads, likes, created_by) VALUES
    ('Tailwind CSS Component', 
     'Tailwind CSS component with responsive design',
     'tailwind-component',
     '// Tailwind CSS component
const ComponentName = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Component Title
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Component description
      </p>
    </div>
  );
};

export default ComponentName;',
     'Tailwind CSS',
     'React',
     ARRAY['tailwind', 'css', 'responsive'],
     0,
     0,
     first_user_id
    ) ON CONFLICT DO NOTHING;

    -- Create a sample user profile
    INSERT INTO user_profiles (user_id, username, display_name, bio, is_public) VALUES
    (first_user_id, 
     'demo-user', 
     'Demo User', 
     'A demo user for testing the Cursor Rules Hub features. I love creating helpful coding rules!',
     true
    ) ON CONFLICT (user_id) DO NOTHING;

    RAISE NOTICE 'Test data created successfully!';
END $$;

-- Show what was created
SELECT 'Categories:' as info, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Cursor rules:', COUNT(*) FROM cursor_rules
UNION ALL
SELECT 'User profiles:', COUNT(*) FROM user_profiles; 