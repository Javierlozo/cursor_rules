import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CreateRuleData } from "@/lib/types/cursor-rule";
import { 
  authenticateRequest, 
  validateRuleData, 
  handleApiError, 
  createSuccessResponse,
  createErrorResponse,
  prepareRuleData 
} from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const framework = searchParams.get('framework');
    const tags = searchParams.get('tags')?.split(',');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from("cursor_rules")
      .select("*")
      .not("created_by", "is", null); // Filter out orphaned rules

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    if (framework) {
      query = query.eq('framework', framework);
    }
    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch rules", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        limit,
        offset,
        hasMore: (data || []).length === limit
      }
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const body: CreateRuleData = await request.json();
    
    validateRuleData(body);
    
    const ruleData = {
      ...prepareRuleData(body),
      created_by: user.id
    };

    const { data, error } = await supabase
      .from("cursor_rules")
      .insert(ruleData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return createErrorResponse("Failed to create rule", 500);
    }

    return createSuccessResponse(data, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
