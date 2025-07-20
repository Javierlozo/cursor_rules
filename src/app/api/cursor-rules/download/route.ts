import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ruleId } = body;

    if (!ruleId) {
      return NextResponse.json(
        { error: "Rule ID is required" },
        { status: 400 }
      );
    }

    // Get current download count and increment
    const { data: currentRule } = await supabase
      .from("cursor_rules")
      .select("downloads")
      .eq("id", ruleId)
      .single();

    if (currentRule) {
      const { error } = await supabase
        .from("cursor_rules")
        .update({ downloads: (currentRule.downloads || 0) + 1 })
        .eq("id", ruleId);

      if (error) {
        console.error("Error updating download count:", error);
        return NextResponse.json(
          { error: "Failed to track download" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: "Download tracked successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 