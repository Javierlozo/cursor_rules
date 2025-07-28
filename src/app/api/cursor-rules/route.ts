import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
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

    // Use admin client to bypass RLS policies
    const { data, error } = await supabaseAdmin
      .from("cursor_rules")
      .insert(ruleData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return createErrorResponse("Failed to create rule", 500);
    }

    // Create notifications for all users about the new rule
    try {
      console.log("🔔 Starting notification creation for rule:", data.name);
      console.log("🔔 supabaseAdmin available:", !!supabaseAdmin);
      
      if (supabaseAdmin) {
        // Get all users
        const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
        
        console.log("🔔 Users fetched:", users?.length || 0);
        console.log("🔔 Users error:", usersError);
        
        if (!usersError && users) {
          // Create notifications for each user (except the creator)
          const notificationPromises = users
            .filter((user: any) => user.id !== data.created_by) // Don't notify the creator
            .map(async (user: any) => {
              try {
                const notificationData = {
                  user_id: user.id,
                  type: 'system',
                  title: 'New Cursor Rule Available! 🎉',
                  message: `A new rule "${data.name}" has been added to the community.`,
                  data: {
                    ruleId: data.id,
                    ruleName: data.name,
                    ruleDescription: data.description,
                    ruleUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cursor-rules/${data.id}`
                  },
                  is_read: false,
                  created_at: new Date().toISOString()
                };
                
                console.log("🔔 Creating notification for user:", user.email, notificationData);
                
                const { error } = await supabaseAdmin
                  .from('notifications')
                  .insert(notificationData);

                if (error) {
                  console.error(`❌ Error creating notification for ${user.email}:`, error);
                  return { success: false, email: user.email, error: error.message };
                }

                console.log("✅ Notification created for user:", user.email);
                return { success: true, email: user.email };
              } catch (error) {
                console.error(`❌ Error creating notification for ${user.email}:`, error);
                return { success: false, email: user.email, error: "Unknown error" };
              }
            });

          const results = await Promise.all(notificationPromises);
          const successful = results.filter(r => r.success).length;
          const failed = results.filter(r => !r.success).length;

          console.log(`🎉 Created notifications: ${successful} successful, ${failed} failed`);
        } else {
          console.log("❌ Failed to fetch users:", usersError);
        }
      } else {
        console.log("❌ supabaseAdmin not available - check SUPABASE_SERVICE_ROLE_KEY");
      }
    } catch (notificationError) {
      // Don't fail the rule creation if notifications fail
      console.error("❌ Error creating notifications:", notificationError);
    }

    return createSuccessResponse(data, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
