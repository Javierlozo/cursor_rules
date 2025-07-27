import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { CreateRuleData } from "@/lib/types/cursor-rule";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("PUT request received for cursor rules API");
  console.log("Request URL:", request.url);
  console.log("Request method:", request.method);
  
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Authentication failed - no valid auth header");
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

    const { id: ruleId } = await params;
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
    console.log("Checking rule ownership. ruleId:", ruleId, "userId:", user.id);
    
    const { data: existingRule, error: fetchError } = await supabase
      .from("cursor_rules")
      .select("id, created_by")
      .eq("id", ruleId)
      .eq("created_by", user.id);

    console.log("Ownership check result:", { existingRule, fetchError });

    if (fetchError) {
      console.error("Error checking rule ownership:", fetchError);
      return NextResponse.json(
        { error: "Failed to verify rule ownership" },
        { status: 500 }
      );
    }

    if (!existingRule || existingRule.length === 0) {
      console.log("Rule not found or user doesn't own it");
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
      file_references: body.file_references || [],
      tags: body.tags || [],
      category: body.category || null,
      framework: body.framework || null,
      updated_at: new Date().toISOString(),
    };

        console.log("Updating rule with data:", updateData);
    
    // Update with all fields using admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from("cursor_rules")
      .update(updateData)
      .eq("id", ruleId)
      .eq("created_by", user.id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to update rule", details: error.message },
        { status: 500 }
      );
    }

    // If no data returned but no error, the update was successful
    // This can happen when the update doesn't return the updated row
    if (!data || data.length === 0) {
      // Fetch the updated rule to return it
      const { data: updatedRule, error: fetchError } = await supabase
        .from("cursor_rules")
        .select("*")
        .eq("id", ruleId)
        .eq("created_by", user.id)
        .single();

      if (fetchError) {
        console.error("Error fetching updated rule:", fetchError);
        return NextResponse.json(
          { error: "Rule updated but failed to fetch updated data" },
          { status: 500 }
        );
      }

      return NextResponse.json(updatedRule);
    }

    return NextResponse.json(data[0]);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    console.log("PUT request completed");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: ruleId } = await params;

    // Check if rule exists and user owns it
    const { data: existingRule, error: fetchError } = await supabase
      .from("cursor_rules")
      .select("id, name")
      .eq("id", ruleId)
      .eq("created_by", user.id);

    if (fetchError) {
      console.error("Error checking rule ownership:", fetchError);
      return NextResponse.json(
        { error: "Failed to verify rule ownership" },
        { status: 500 }
      );
    }

    if (!existingRule || existingRule.length === 0) {
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

    console.log("Rule deleted successfully:", existingRule[0].name);
    return NextResponse.json({ message: "Rule deleted successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 