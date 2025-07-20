const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please create a .env.local file with these variables.');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateOrphanedRules() {
  try {
    console.log('🔍 Checking for orphaned rules (rules with no created_by)...');
    
    // Find all rules with created_by = null
    const { data: orphanedRules, error: fetchError } = await supabase
      .from("cursor_rules")
      .select("*")
      .is("created_by", null);

    if (fetchError) {
      console.error('Error fetching orphaned rules:', fetchError);
      return;
    }

    if (orphanedRules.length === 0) {
      console.log('✅ No orphaned rules found. All rules have proper ownership.');
      return;
    }

    console.log(`📋 Found ${orphanedRules.length} orphaned rule(s):`);
    orphanedRules.forEach(rule => {
      console.log(`   - ${rule.name} (ID: ${rule.id})`);
    });

    console.log('\n🔄 Options to handle orphaned rules:');
    console.log('1. Delete orphaned rules');
    console.log('2. Assign to a specific user (provide email)');
    console.log('3. Mark as community rules (set created_by to a special value)');
    
    // For now, let's delete orphaned rules as they were created before auth
    console.log('\n🗑️  Deleting orphaned rules...');
    
    const { error: deleteError } = await supabase
      .from("cursor_rules")
      .delete()
      .is("created_by", null);

    if (deleteError) {
      console.error('Error deleting orphaned rules:', deleteError);
      return;
    }

    console.log(`✅ Successfully deleted ${orphanedRules.length} orphaned rule(s)`);
    console.log('💡 Users can now create new rules with proper authentication.');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateOrphanedRules(); 