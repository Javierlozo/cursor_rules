import { supabase } from '../src/lib/supabase';

const sampleRules = [
  {
    name: "React TypeScript Best Practices",
    description: "Comprehensive rules for writing clean, maintainable React components with TypeScript",
    pattern: "*.tsx",
    rule_content: `# React TypeScript Best Practices

When working with React and TypeScript:
- Always use proper type definitions for props and state
- Prefer functional components with hooks
- Use TypeScript interfaces for prop definitions
- Implement proper error boundaries
- Follow React naming conventions`,
    category: "React",
    framework: "React",
    tags: ["react", "typescript", "frontend"],
    downloads: 15,
    likes: 8
  },
  {
    name: "Node.js API Patterns",
    description: "Consistent API development patterns with proper error handling and validation",
    pattern: "src/**/*.js",
    rule_content: `# Node.js API Patterns

When building Node.js APIs:
- Use async/await for all database operations
- Implement proper error handling with try/catch
- Validate input data with Joi or similar
- Use environment variables for configuration
- Implement proper logging and monitoring`,
    category: "API",
    framework: "Express",
    tags: ["nodejs", "api", "express"],
    downloads: 23,
    likes: 12
  },
  {
    name: "Testing with Jest",
    description: "Comprehensive testing rules for unit and integration tests",
    pattern: "**/*.test.js",
    rule_content: `# Testing with Jest

When writing tests with Jest:
- Use descriptive test names
- Group related tests with describe blocks
- Mock external dependencies
- Test both success and error cases
- Use beforeEach and afterEach for setup/cleanup`,
    category: "Testing",
    framework: "Jest",
    tags: ["testing", "jest", "unit-tests"],
    downloads: 31,
    likes: 18
  },
  {
    name: "Vue.js Component Guidelines",
    description: "Best practices for Vue.js component development",
    pattern: "*.vue",
    rule_content: `# Vue.js Component Guidelines

When creating Vue.js components:
- Use Composition API for complex components
- Keep components focused and single-purpose
- Use proper prop validation
- Implement proper event handling
- Follow Vue.js style guide conventions`,
    category: "UI/UX",
    framework: "Vue",
    tags: ["vue", "frontend", "components"],
    downloads: 12,
    likes: 6
  },
  {
    name: "Database Security Rules",
    description: "Security best practices for database operations",
    pattern: "src/db/**/*.js",
    rule_content: `# Database Security Rules

When working with databases:
- Always use parameterized queries
- Validate and sanitize all inputs
- Implement proper access controls
- Use connection pooling
- Monitor for SQL injection attempts`,
    category: "Security",
    framework: "General",
    tags: ["security", "database", "sql"],
    downloads: 19,
    likes: 11
  }
];

async function seedData() {
  try {
    console.log('Seeding sample data...');

    // Insert sample rules
    for (const rule of sampleRules) {
      const { data, error } = await supabase
        .from('cursor_rules')
        .insert(rule)
        .select()
        .single();

      if (error) {
        console.error('Error inserting rule:', error);
      } else {
        console.log(`Inserted rule: ${rule.name}`);
      }
    }

    // Add some download records
    const downloadRecords = [];
    for (let i = 0; i < 50; i++) {
      const randomRuleIndex = Math.floor(Math.random() * sampleRules.length);
      downloadRecords.push({
        rule_id: `rule-${randomRuleIndex + 1}`, // This would be the actual rule ID
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`
      });
    }

    console.log('Sample data seeded successfully!');
    console.log('Visit http://localhost:3000 to see the real statistics.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run the seed function
seedData(); 