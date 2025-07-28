import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import CursorRuleDetailClient from "@/components/cursor-rules/CursorRuleDetailClient";

// Generate metadata for individual rule pages
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data: rule } = await supabase
      .from("cursor_rules")
      .select("*")
      .eq("id", id)
      .single();

    if (!rule) {
      return {
        title: "Rule Not Found",
        description: "The requested Cursor rule could not be found.",
      };
    }

    const description = rule.description || `Cursor AI rule: ${rule.name}`;
    const keywords = [
      "cursor rule",
      rule.name.toLowerCase(),
      rule.pattern?.toLowerCase() || "",
      rule.framework?.toLowerCase() || "",
      rule.category?.toLowerCase() || "",
    ].filter(Boolean);

    return {
      title: rule.name,
      description: description,
      keywords: keywords,
      openGraph: {
        title: `${rule.name} - Cursor Rule`,
        description: description,
        url: `https://cursor-rules-hub.vercel.app/cursor-rules/${id}`,
        siteName: "Cursor Rules Hub",
        images: [
          {
            url: "/og-rule.png",
            width: 1200,
            height: 630,
            alt: `${rule.name} - Cursor AI Rule`,
          },
        ],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${rule.name} - Cursor Rule`,
        description: description,
        images: ["/og-rule.png"],
      },
      alternates: {
        canonical: `/cursor-rules/${id}`,
      },
    };
  } catch (error) {
    return {
      title: "Rule Not Found",
      description: "The requested Cursor rule could not be found.",
    };
  }
}

export default async function CursorRuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <main className="container mx-auto px-4 py-8">
      <CursorRuleDetailClient ruleId={id} />
    </main>
  );
} 