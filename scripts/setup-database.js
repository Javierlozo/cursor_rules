const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ipvrznhfatyblylpseqw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwdnJ6bmhmYXR5Ymx5bHBzZXF3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzAyMjQ0NiwiZXhwIjoyMDY4NTk4NDQ2fQ.zvCCs7rPGpU1hB9gviCt_41FMLxxT2RTC_8y5GeMZ0M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Create cursor_rules table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cursor_rules (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          pattern VARCHAR(255),
          rule_content TEXT NOT NULL,
          references TEXT[],
          tags TEXT[],
          category VARCHAR(100),
          framework VARCHAR(100),
          downloads INTEGER DEFAULT 0,
          likes INTEGER DEFAULT 0,
          created_by UUID,
          cursor_properties JSONB DEFAULT '{"color": "#3B82F6", "size": "medium", "shape": "default"}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
      `
    });

    if (tableError) {
      console.error('Error creating table:', tableError);
      return;
    }

    console.log('✅ Database setup complete!');
    console.log('You can now use the Cursor Rules Hub app.');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase(); 