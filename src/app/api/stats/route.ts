import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Get total rules count (excluding orphaned rules)
    const { count: totalRules } = await supabase
      .from("cursor_rules")
      .select("*", { count: "exact", head: true })
      .not("created_by", "is", null);

    // Get unique contributors (users who created rules)
    const { data: contributorsData } = await supabase
      .from("cursor_rules")
      .select("created_by")
      .not("created_by", "is", null);

    // Get top categories (excluding orphaned rules)
    const { data: categoriesData } = await supabase
      .from("cursor_rules")
      .select("category")
      .not("category", "is", null)
      .not("created_by", "is", null);

    // Calculate statistics
    const uniqueContributors = new Set(contributorsData?.map(r => r.created_by) || []).size;

    // Calculate top categories
    const categoryCounts: { [key: string]: number } = {};
    categoriesData?.forEach(rule => {
      if (rule.category) {
        categoryCounts[rule.category] = (categoryCounts[rule.category] || 0) + 1;
      }
    });

    const topCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Get recent rules (excluding orphaned rules)
    const { data: recentRules } = await supabase
      .from("cursor_rules")
      .select("*")
      .not("created_by", "is", null)
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      totalRules: totalRules || 0,
      uniqueContributors,
      topCategories,
      recentRules: recentRules || []
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
} 