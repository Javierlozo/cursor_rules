import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { CreateRuleData } from "@/lib/types/cursor-rule";
import { 
  authenticateRequest, 
  validateRuleData, 
  checkRuleOwnership,
  handleApiError, 
  createSuccessResponse,
  createErrorResponse,
  prepareRuleData 
} from "@/lib/api-utils";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request);
    const { id: ruleId } = await params;
    const body: CreateRuleData = await request.json();

    validateRuleData(body);
    await checkRuleOwnership(ruleId, user.id);

    const updateData = prepareRuleData(body, true);
    
    // Update with all fields using admin client to bypass RLS
    const { data, error } = await supabaseAdmin
      .from("cursor_rules")
      .update(updateData)
      .eq("id", ruleId)
      .eq("created_by", user.id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return createErrorResponse("Failed to update rule", 500);
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
        return createErrorResponse("Rule updated but failed to fetch updated data", 500);
      }

      return createSuccessResponse(updatedRule);
    }

    return createSuccessResponse(data[0]);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request);
    const { id: ruleId } = await params;

    const existingRule = await checkRuleOwnership(ruleId, user.id);

    const { error } = await supabase
      .from("cursor_rules")
      .delete()
      .eq("id", ruleId)
      .eq("created_by", user.id); // Extra security check

    if (error) {
      console.error("Supabase error:", error);
      return createErrorResponse("Failed to delete rule", 500);
    }

    return createSuccessResponse({ message: "Rule deleted successfully" });
  } catch (err) {
    return handleApiError(err);
  }
} 