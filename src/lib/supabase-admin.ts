import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error("NEXT_PUBLIC_SUPABASE_URL is missing");
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
}

if (!supabaseServiceKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is missing");
  // Don't throw error during build, just log it
  if (process.env.NODE_ENV === 'production') {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not available in production");
  }
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}); 