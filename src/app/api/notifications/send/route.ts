import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    // Prevent execution during build time
    if (process.env.NODE_ENV === 'production' && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Service not available" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { ruleName, ruleDescription, ruleId } = body;

    if (!ruleName || !ruleId) {
      return NextResponse.json(
        { error: "Rule name and ID are required" },
        { status: 400 }
      );
    }

    // Get all users
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    // Try to create notifications, but don't fail if table doesn't exist
    try {
      // Create notifications in the database for each user
      const notificationPromises = users.map(async (user) => {
        try {
          // Insert notification into database
          const { error } = await supabaseAdmin
            .from('notifications')
            .insert({
              user_id: user.id,
              type: 'new_rule',
              title: 'New Cursor Rule Available! 🎉',
              message: `A new rule "${ruleName}" has been added to the community.`,
              data: {
                ruleId,
                ruleName,
                ruleDescription,
                ruleUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cursor-rules/${ruleId}`
              },
              read: false,
              created_at: new Date().toISOString()
            });

          if (error) {
            console.error(`Error creating notification for ${user.email}:`, error);
            return { success: false, email: user.email, error: error.message };
          }

          return { success: true, email: user.email };
        } catch (error) {
          console.error(`Error creating notification for ${user.email}:`, error);
          return { success: false, email: user.email, error: "Unknown error" };
        }
      });

      const results = await Promise.all(notificationPromises);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return NextResponse.json({
        message: "Notifications created",
        total: users.length,
        successful,
        failed,
        results
      });
    } catch (tableError) {
      // If notifications table doesn't exist, just log and return success
      console.warn("Notifications table not found, skipping notifications:", tableError);
      return NextResponse.json({
        message: "Rule created successfully (notifications table not available)",
        total: users.length,
        successful: 0,
        failed: 0,
        note: "Notifications table not found in database"
      });
    }

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 