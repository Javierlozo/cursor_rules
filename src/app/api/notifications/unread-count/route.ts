import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
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

    // Check if notifications table exists
    let notificationsExist = false;
    try {
      const { data: testQuery } = await supabase
        .from("notifications")
        .select("id")
        .limit(1);
      notificationsExist = true;
    } catch (error) {
      // Table doesn't exist or not accessible
      notificationsExist = false;
    }

    if (!notificationsExist) {
      // Notifications table doesn't exist yet, return 0
      return NextResponse.json({ count: 0 });
    }

    // Get unread notification count using direct query
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Error fetching unread count:", error);
      // Return 0 instead of error to prevent breaking the UI
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });

  } catch (err) {
    console.error("Unexpected error:", err);
    // Return 0 instead of error to prevent breaking the UI
    return NextResponse.json({ count: 0 });
  }
} 