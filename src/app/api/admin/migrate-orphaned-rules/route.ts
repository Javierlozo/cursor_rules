import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
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

    // Find orphaned rules (created_by = null)
    const { data: orphanedRules, error: fetchError } = await supabase
      .from("cursor_rules")
      .select("*")
      .is("created_by", null);

    if (fetchError) {
      console.error("Error fetching orphaned rules:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch orphaned rules" },
        { status: 500 }
      );
    }

    if (orphanedRules.length === 0) {
      return NextResponse.json({
        message: "No orphaned rules found",
        count: 0
      });
    }

    // Delete orphaned rules
    const { error: deleteError } = await supabase
      .from("cursor_rules")
      .delete()
      .is("created_by", null);

    if (deleteError) {
      console.error("Error deleting orphaned rules:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete orphaned rules" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully deleted ${orphanedRules.length} orphaned rule(s)`,
      count: orphanedRules.length,
      deletedRules: orphanedRules.map(rule => ({ id: rule.id, name: rule.name }))
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 