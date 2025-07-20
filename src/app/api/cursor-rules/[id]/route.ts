import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CreateRuleData } from "@/lib/types/cursor-rule";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const ruleId = params.id;
    const body: CreateRuleData = await request.json();

    // Validation
    if (!body.name || !body.rule_content) {
      return NextResponse.json(
        { error: "Name and rule_content are required" },
        { status: 400 }
      );
    }

    if (body.name.length > 255) {
      return NextResponse.json(
        { error: "Name must be less than 255 characters" },
        { status: 400 }
      );
    }

    // Check if rule exists and user owns it
    const { data: existingRule, error: fetchError } = await supabase
      .from("cursor_rules")
      .select("id, created_by")
      .eq("id", ruleId)
      .eq("created_by", user.id)
      .single();

    if (fetchError || !existingRule) {
      return NextResponse.json(
        { error: "Rule not found or you don't have permission to edit it" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      pattern: body.pattern?.trim() || null,
      rule_content: body.rule_content.trim(),
      file_references: body.references || [],
      tags: body.tags || [],
      category: body.category || null,
      framework: body.framework || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("cursor_rules")
      .update(updateData)
      .eq("id", ruleId)
      .eq("created_by", user.id) // Extra security check
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to update rule", details: error.message },
        { status: 500 }
      );
    }

    console.log("Rule updated successfully:", data.name);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const ruleId = params.id;

    // Check if rule exists and user owns it
    const { data: existingRule, error: fetchError } = await supabase
      .from("cursor_rules")
      .select("id, name")
      .eq("id", ruleId)
      .eq("created_by", user.id)
      .single();

    if (fetchError || !existingRule) {
      return NextResponse.json(
        { error: "Rule not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("cursor_rules")
      .delete()
      .eq("id", ruleId)
      .eq("created_by", user.id); // Extra security check

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to delete rule", details: error.message },
        { status: 500 }
      );
    }

    console.log("Rule deleted successfully:", existingRule.name);
    return NextResponse.json({ message: "Rule deleted successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 