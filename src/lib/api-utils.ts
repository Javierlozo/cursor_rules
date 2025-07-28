import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CreateRuleData } from "@/lib/types/cursor-rule";

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

/**
 * Authenticate a request and return the user
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedUser> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authentication required');
  }
  
  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new Error('Invalid authentication token');
  }
  
  return {
    id: user.id,
    email: user.email
  };
}

/**
 * Validate rule data for creation/updates
 */
export function validateRuleData(body: CreateRuleData): void {
  if (!body.name || !body.rule_content) {
    throw new Error('Name and rule_content are required');
  }
  
  if (body.name.length > 255) {
    throw new Error('Name must be less than 255 characters');
  }
}

/**
 * Check if a user owns a rule
 */
export async function checkRuleOwnership(ruleId: string, userId: string) {
  const { data: existingRule, error } = await supabase
    .from("cursor_rules")
    .select("id, created_by")
    .eq("id", ruleId)
    .eq("created_by", userId);

  if (error) {
    throw new Error('Failed to verify rule ownership');
  }

  if (!existingRule || existingRule.length === 0) {
    throw new Error('Rule not found or you don\'t have permission to edit it');
  }

  return existingRule[0];
}

/**
 * Create standardized error responses
 */
export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Create standardized success responses
 */
export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);
  
  if (error instanceof Error) {
    if (error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401);
    }
    if (error.message === 'Invalid authentication token') {
      return createErrorResponse('Invalid authentication token', 401);
    }
    if (error.message.includes('required') || error.message.includes('less than')) {
      return createErrorResponse(error.message, 400);
    }
    if (error.message.includes('not found') || error.message.includes('permission')) {
      return createErrorResponse(error.message, 404);
    }
  }
  
  return createErrorResponse('Internal Server Error', 500);
}

/**
 * Prepare rule data for database operations
 */
export function prepareRuleData(body: CreateRuleData, isUpdate: boolean = false) {
  const baseData = {
    name: body.name.trim(),
    description: body.description?.trim() || null,
    pattern: body.pattern?.trim() || null,
    rule_content: body.rule_content.trim(),
    file_references: body.file_references || [],
    tags: body.tags || [],
    category: body.category || null,
    framework: body.framework || null,
  };

  if (isUpdate) {
    // For updates
    return {
      ...baseData,
      updated_at: new Date().toISOString(),
    };
  } else {
    // For creation
    return {
      ...baseData,
      cursor_properties: {
        color: '#3B82F6',
        size: 'medium',
        shape: 'default'
      }
    };
  }
} 