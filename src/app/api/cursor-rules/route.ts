import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { CreateRuleData } from "@/lib/types/cursor-rule";

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

    // Prepare data with defaults
    const ruleData = {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      pattern: body.pattern?.trim() || null,
      rule_content: body.rule_content.trim(),
      file_references: body.references || [],
      tags: body.tags || [],
      category: body.category || null,
      framework: body.framework || null,
      downloads: 0,
      likes: 0,
      created_by: user.id, // Set the authenticated user
      cursor_properties: {
        color: '#3B82F6',
        size: 'medium',
        shape: 'default'
      }
    };

    const { data, error } = await supabase
      .from("cursor_rules")
      .insert(ruleData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create rule", details: error.message },
        { status: 500 }
      );
    }

    console.log("Rule created successfully:", data.name);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
