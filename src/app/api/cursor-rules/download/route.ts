import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { ruleId } = await request.json();

    if (!ruleId) {
      return NextResponse.json(
        { error: "Rule ID is required" },
        { status: 400 }
      );
    }

    // Get user agent and IP for tracking
    const userAgent = request.headers.get('user-agent') || '';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';

    // Insert download record
    const { data, error } = await supabase
      .from('rule_downloads')
      .insert({
        rule_id: ruleId,
        user_agent: userAgent,
        ip_address: ipAddress,
      })
      .select()
      .single();

    if (error) {
      console.error("Error tracking download:", error);
      return NextResponse.json(
        { error: "Failed to track download" },
        { status: 500 }
      );
    }

    // Update the rule's download count
    const { data: currentRule } = await supabase
      .from('cursor_rules')
      .select('downloads')
      .eq('id', ruleId)
      .single();

    if (currentRule) {
      const { error: updateError } = await supabase
        .from('cursor_rules')
        .update({ 
          downloads: (currentRule.downloads || 0) + 1
        })
        .eq('id', ruleId);

      if (updateError) {
        console.error("Error updating download count:", updateError);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 