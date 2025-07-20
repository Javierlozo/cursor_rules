export interface CursorProperties {
  color: string;
  size: number;
  shape: "circle" | "square" | "custom";
}

export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface CursorRule {
  id: string;
  name: string;
  description: string | null;
  pattern: string | null;
  rule_content: string;
  file_references: string[];
  tags: string[];
  category: string | null;
  framework: string | null;
  downloads: number;
  likes: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRuleData {
  name: string;
  description?: string;
  pattern?: string;
  rule_content: string;
  file_references?: string[];
  tags?: string[];
  category?: string;
  framework?: string;
}

export interface SearchFilters {
  category?: string;
  framework?: string;
  tags?: string[];
  pattern?: string;
  sortBy?: 'created_at' | 'downloads' | 'likes' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface RuleStats {
  totalRules: number;
  totalDownloads: number;
  totalLikes: number;
  topCategories: Array<{ name: string; count: number }>;
  recentRules: CursorRule[];
}
