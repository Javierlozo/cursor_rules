import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error("NEXT_PUBLIC_SUPABASE_URL is missing");
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
}

// Only create the client if we have the service key, otherwise return null
let supabaseAdmin: any = null;

if (supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
} else {
  console.warn("SUPABASE_SERVICE_ROLE_KEY not available - admin functions will be disabled");
}

export { supabaseAdmin }; 