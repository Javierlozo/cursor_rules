# Database Development Patterns

## Rule Name
Database Best Practices

## Description
This rule enforces database development best practices including proper schema design, query optimization, data validation, and security patterns.

## Pattern
```sql
-- Database table with proper structure
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Other columns
);

-- Indexes for performance
CREATE INDEX idx_table_name_column ON table_name(column_name);

-- Row Level Security
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

## Rule Content
```sql
-- Database Development Best Practices

-- 1. Always use UUIDs for primary keys
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Use proper data types
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add proper constraints
ALTER TABLE users ADD CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE posts ADD CONSTRAINT title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 255);

-- 4. Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_published ON posts(published) WHERE published = true;
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- 5. Implement Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view published posts" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Users can view their own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- 6. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_posts(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  published BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.title, p.content, p.published, p.created_at
  FROM posts p
  WHERE p.user_id = user_uuid
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create views for complex queries
CREATE VIEW published_posts_with_author AS
SELECT 
  p.id,
  p.title,
  p.content,
  p.published,
  p.created_at,
  u.username as author_username,
  u.email as author_email
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.published = true
ORDER BY p.created_at DESC;

-- 9. Implement soft deletes
ALTER TABLE posts ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_posts_deleted_at ON posts(deleted_at) WHERE deleted_at IS NULL;

-- Update RLS to exclude soft deleted records
DROP POLICY IF EXISTS "Users can view published posts" ON posts;
CREATE POLICY "Users can view published posts" ON posts
  FOR SELECT USING (published = true AND deleted_at IS NULL);

-- 10. Create audit trail
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Implement proper foreign keys
ALTER TABLE posts ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE posts ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 12. Create composite indexes for complex queries
CREATE INDEX idx_posts_user_published ON posts(user_id, published, created_at DESC);

-- 13. Implement full-text search
ALTER TABLE posts ADD COLUMN search_vector tsvector;
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

CREATE OR REPLACE FUNCTION posts_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_search_update
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION posts_search_update();

-- 14. Create materialized views for expensive queries
CREATE MATERIALIZED VIEW popular_posts AS
SELECT 
  p.id,
  p.title,
  p.view_count,
  u.username as author,
  p.created_at
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.published = true AND p.deleted_at IS NULL
ORDER BY p.view_count DESC, p.created_at DESC
LIMIT 100;

-- Refresh materialized view
CREATE OR REPLACE FUNCTION refresh_popular_posts()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW popular_posts;
END;
$$ LANGUAGE plpgsql;
```

## Tags
Database, PostgreSQL, SQL, Performance, Security, RLS, Indexes, Best Practices

## Category
Database

## Framework
PostgreSQL

## File References
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Row Level Security: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Performance tuning: https://www.postgresql.org/docs/current/performance.html
- Full-text search: https://www.postgresql.org/docs/current/textsearch.html

## Usage Examples

### User Management
```sql
-- Create user with profile
INSERT INTO users (email, username) 
VALUES ('user@example.com', 'username')
RETURNING id;

-- Get user with posts count
SELECT 
  u.id,
  u.email,
  u.username,
  COUNT(p.id) as posts_count,
  COUNT(p.id) FILTER (WHERE p.published = true) as published_posts
FROM users u
LEFT JOIN posts p ON u.id = p.user_id AND p.deleted_at IS NULL
WHERE u.id = $1
GROUP BY u.id;
```

### Post Management
```sql
-- Create post with tags
INSERT INTO posts (title, content, user_id, tags, published)
VALUES ('My Post', 'Content here', $1, ARRAY['react', 'typescript'], true)
RETURNING id;

-- Search posts
SELECT id, title, content, created_at
FROM posts
WHERE search_vector @@ plainto_tsquery('english', $1)
  AND published = true 
  AND deleted_at IS NULL
ORDER BY ts_rank(search_vector, plainto_tsquery('english', $1)) DESC;
```

## Best Practices Checklist

- ✅ Use UUIDs for primary keys
- ✅ Add proper constraints and checks
- ✅ Create indexes for performance
- ✅ Implement Row Level Security (RLS)
- ✅ Use proper data types
- ✅ Add created_at/updated_at timestamps
- ✅ Create triggers for automatic updates
- ✅ Implement soft deletes
- ✅ Add audit trails
- ✅ Use foreign keys with proper actions
- ✅ Create views for complex queries
- ✅ Implement full-text search
- ✅ Use materialized views for expensive queries
- ✅ Add composite indexes for complex queries
- ✅ Create functions for common operations
- ✅ Use proper naming conventions
- ✅ Add comments for complex queries
- ✅ Implement proper error handling
- ✅ Use transactions for data integrity
- ✅ Regular maintenance and optimization 