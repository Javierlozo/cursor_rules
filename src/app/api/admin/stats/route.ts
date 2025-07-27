import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  // Prevent execution during build time
  if (process.env.NODE_ENV === 'production' && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Service not available" },
      { status: 503 }
    );
  }

  // Check if admin client is available
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Admin service not configured" },
      { status: 503 }
    );
  }

  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const isAdmin = user.email === "admin@example.com" || user.user_metadata?.role === "admin";
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get admin stats using admin client
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    const totalUsers = users.length;
    
    // Get active users (users who signed in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = users.filter((u: { last_sign_in_at?: string }) => 
      u.last_sign_in_at && new Date(u.last_sign_in_at) > thirtyDaysAgo
    ).length;

    // Get total rules
    const { count: totalRules } = await supabase
      .from("cursor_rules")
      .select("*", { count: "exact", head: true });

    

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalRules: totalRules || 0,
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 