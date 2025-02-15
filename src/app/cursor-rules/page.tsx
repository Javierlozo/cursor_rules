import CursorRulesList from "@/components/cursor-rules/CursorRulesList";
import { supabase } from "@/lib/supabase";
import { CursorRule } from "@/lib/types/cursor-rule";

export default async function CursorRulesPage() {
  const { data: rules = [] } = await supabase
    .from("cursor_rules")
    .select("*")
    .returns<CursorRule[]>();

  // Ensure rules is always an array
  const safeRules: CursorRule[] = rules ?? [];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cursor Rules</h1>
        <a
          href="/cursor-rules/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Create New Rule
        </a>
      </div>

      <div className="mb-6">
        {/* We'll add search and filter components here later */}
      </div>

      <CursorRulesList rules={safeRules} />
    </main>
  );
}
