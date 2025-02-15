export interface CursorProperties {
  color: string;
  size: number;
  shape: "circle" | "square" | "custom";
}

export interface CursorRule {
  id: string;
  name: string;
  description: string | null;
  pattern: string | null;
  rule_content: string;
  references: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
