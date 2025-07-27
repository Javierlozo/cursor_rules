"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiCode, FiCopy, FiCheck, FiPlus, FiUsers } from "react-icons/fi";

const ruleTemplates = [
  {
    id: "react-typescript",
    name: "React TypeScript Component",
    description: "Standard React component with TypeScript interfaces and proper typing",
    category: "React",
    framework: "React",
    pattern: "*.tsx",
    tags: ["react", "typescript", "components"],
    difficulty: "Beginner",
    content: `# React TypeScript Component Pattern

When creating React components with TypeScript:

## Component Structure
- Use functional components with hooks
- Define TypeScript interfaces for all props
- Use proper type annotations for state and refs
- Implement proper error boundaries

## Props Interface
\`\`\`typescript
interface ComponentProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}
\`\`\`

## Component Template
\`\`\`typescript
import React from 'react';

interface ComponentProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={\`component \${className}\`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
};
\`\`\`

## Best Practices
- Always use TypeScript interfaces for prop definitions
- Implement proper error handling
- Use meaningful component and prop names
- Follow React naming conventions
- Add proper JSDoc comments for complex components`
  },
  {
    id: "api-endpoint",
    name: "API Endpoint Pattern",
    description: "Consistent API endpoint structure with error handling and validation",
    category: "API",
    framework: "Express",
    pattern: "src/api/**/*.js",
    tags: ["api", "express", "error-handling"],
    difficulty: "Intermediate",
    content: `# API Endpoint Pattern

When creating API endpoints:

## Structure
- Use async/await for all database operations
- Implement proper error handling with try-catch
- Validate input data before processing
- Return consistent response formats

## Error Handling Template
\`\`\`javascript
const handleApiRequest = async (req, res) => {
  try {
    // Validate input
    const { requiredField } = req.body;
    if (!requiredField) {
      return res.status(400).json({
        success: false,
        error: 'Required field is missing'
      });
    }

    // Process request
    const result = await processData(requiredField);

    // Return success response
    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
\`\`\`

## Response Format
- Always use consistent response structure
- Include success/error flags
- Provide meaningful error messages
- Log errors for debugging

## Validation
- Validate all input data
- Use middleware for common validations
- Sanitize user inputs
- Check required fields`
  },
  {
    id: "testing-jest",
    name: "Jest Testing Pattern",
    description: "Comprehensive testing setup with Jest and React Testing Library",
    category: "Testing",
    framework: "Jest",
    pattern: "**/*.test.js",
    tags: ["testing", "jest", "react-testing-library"],
    difficulty: "Intermediate",
    content: `# Jest Testing Pattern

When writing tests with Jest:

## Test Structure
- Use descriptive test names
- Group related tests with describe blocks
- Mock external dependencies
- Test both success and error cases

## Component Testing Template
\`\`\`javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description'
  };

  it('renders with required props', () => {
    render(<Component {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('handles optional props correctly', () => {
    render(<Component title="Test" />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const mockOnClick = jest.fn();
    render(<Component {...defaultProps} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
\`\`\`

## Best Practices
- Test component behavior, not implementation
- Use meaningful test descriptions
- Mock external dependencies
- Test edge cases and error scenarios
- Keep tests focused and isolated`
  },
  {
    id: "database-query",
    name: "Database Query Pattern",
    description: "Safe database operations with proper error handling and connection management",
    category: "Database",
    framework: "General",
    pattern: "src/db/**/*.js",
    tags: ["database", "sql", "security"],
    difficulty: "Advanced",
    content: `# Database Query Pattern

When working with databases:

## Security First
- Always use parameterized queries
- Validate and sanitize all inputs
- Implement proper access controls
- Use connection pooling

## Query Template
\`\`\`javascript
const getUserById = async (userId) => {
  try {
    // Validate input
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID');
    }

    // Use parameterized query
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];

  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch user');
  }
};
\`\`\`

## Connection Management
- Use connection pooling
- Always close connections
- Handle connection errors gracefully
- Implement retry logic for transient failures

## Best Practices
- Never use string concatenation for queries
- Always validate input data
- Log database errors for debugging
- Use transactions for multi-step operations
- Implement proper error handling`
  }
];

export default function TemplatesPage() {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyTemplate = async (template: typeof ruleTemplates[0]) => {
    try {
      await navigator.clipboard.writeText(template.content);
      setCopiedId(template.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy template:", err);
    }
  };

  const handleUseTemplate = (template: typeof ruleTemplates[0]) => {
    // Navigate to create page with template data
    const params = new URLSearchParams({
      name: template.name,
      description: template.description,
      pattern: template.pattern,
      category: template.category,
      framework: template.framework,
      tags: template.tags.join(','),
      content: template.content
    });
    
    router.push(`/cursor-rules/create?${params.toString()}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Rule Templates</h1>
          <p className="text-xl text-gray-400 mb-8">
            Get started quickly with these pre-built rule templates, or create your own from scratch
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/cursor-rules/create"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5" />
              Create Custom Rule
            </a>
            <a
              href="/cursor-rules"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-2"
            >
              <FiUsers className="w-5 h-5" />
              Browse Community Rules
            </a>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {ruleTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-400 mb-3">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded border border-blue-700/30">
                      {template.category}
                    </span>
                    <span className="inline-block bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded border border-green-700/30">
                      {template.framework}
                    </span>
                    <span className={`inline-block text-xs px-2 py-1 rounded border ${
                      template.difficulty === 'Beginner' ? 'bg-green-900/50 text-green-300 border-green-700/30' :
                      template.difficulty === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700/30' :
                      'bg-red-900/50 text-red-300 border-red-700/30'
                    }`}>
                      {template.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-400">
                  <strong>Pattern:</strong> {template.pattern}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                  >
                    <FiCode className="w-4 h-4" />
                    Use Template
                  </button>
                  <button
                    onClick={() => copyTemplate(template)}
                    className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-white"
                    title={copiedId === template.id ? "Copied!" : "Copy content"}
                  >
                    {copiedId === template.id ? (
                      <FiCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      <FiCopy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-6 text-white">Ready to Contribute?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            These templates are just starting points. The real power comes from the community sharing their own 
            specialized rules and patterns. Create rules that reflect your team&apos;s unique coding standards!
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/cursor-rules/create"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Create Your Own Rule
            </a>
            <a
              href="/guidelines"
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Read Guidelines
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 