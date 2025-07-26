-- Seed data for Cursor Rules Hub MVP

-- Insert categories
INSERT INTO categories (name, description, color) VALUES
('React', 'React components, hooks, and patterns', '#61DAFB'),
('API', 'Backend API patterns and best practices', '#FF6B6B'),
('Testing', 'Testing strategies and frameworks', '#4ECDC4'),
('Database', 'Database operations and security', '#45B7D1'),
('Security', 'Security best practices and patterns', '#FFE66D'),
('Performance', 'Performance optimization patterns', '#FF6B9D'),
('TypeScript', 'TypeScript patterns and best practices', '#3178C6'),
('Node.js', 'Node.js server patterns and practices', '#68A063'),
('CSS', 'CSS and styling patterns', '#1572B6'),
('Git', 'Git workflow and commit patterns', '#F05032');

-- Insert sample rules (these will be created by a system user)
-- Note: In production, these would be created by actual users

-- React TypeScript Component Pattern
INSERT INTO cursor_rules (
    name, 
    description, 
    pattern, 
    rule_content, 
    tags, 
    category, 
    framework, 
    downloads, 
    likes
) VALUES (
    'React TypeScript Component Pattern',
    'Standard React component with TypeScript interfaces and proper typing',
    '*.tsx',
    '# React TypeScript Component Pattern

When creating React components with TypeScript:

## Component Structure
- Use functional components with hooks
- Define TypeScript interfaces for all props
- Use proper type annotations for state and refs
- Implement proper error boundaries

## Props Interface
```typescript
interface ComponentProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}
```

## Component Template
```typescript
import React from ''react'';

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
  className = ''''
}) => {
  return (
    <div className={`component ${className}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
};
```

## Best Practices
- Always use TypeScript interfaces for prop definitions
- Implement proper error handling
- Use meaningful component and prop names
- Follow React naming conventions
- Add proper JSDoc comments for complex components',
    ARRAY['react', 'typescript', 'components'],
    'React',
    'React',
    15,
    8
);

-- API Endpoint Pattern
INSERT INTO cursor_rules (
    name, 
    description, 
    pattern, 
    rule_content, 
    tags, 
    category, 
    framework, 
    downloads, 
    likes
) VALUES (
    'API Endpoint Pattern',
    'Consistent API endpoint structure with error handling and validation',
    'src/api/**/*.js',
    '# API Endpoint Pattern

When creating API endpoints:

## Structure
- Use async/await for all database operations
- Implement proper error handling with try-catch
- Validate input data before processing
- Return consistent response formats

## Error Handling Template
```javascript
const handleApiRequest = async (req, res) => {
  try {
    // Validate input
    const { requiredField } = req.body;
    if (!requiredField) {
      return res.status(400).json({
        success: false,
        error: ''Required field is missing''
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
    console.error(''API Error:'', error);
    return res.status(500).json({
      success: false,
      error: ''Internal server error''
    });
  }
};
```

## Response Format
- Always use consistent response structure
- Include success/error flags
- Provide meaningful error messages
- Log errors for debugging

## Validation
- Validate all input data
- Use middleware for common validations
- Sanitize user inputs
- Check required fields',
    ARRAY['api', 'express', 'error-handling'],
    'API',
    'Express',
    12,
    6
);

-- Jest Testing Pattern
INSERT INTO cursor_rules (
    name, 
    description, 
    pattern, 
    rule_content, 
    tags, 
    category, 
    framework, 
    downloads, 
    likes
) VALUES (
    'Jest Testing Pattern',
    'Comprehensive testing setup with Jest and React Testing Library',
    '**/*.test.js',
    '# Jest Testing Pattern

When writing tests with Jest:

## Test Structure
- Use descriptive test names
- Group related tests with describe blocks
- Mock external dependencies
- Test both success and error cases

## Component Testing Template
```javascript
import { render, screen, fireEvent } from ''@testing-library/react'';
import { Component } from ''./Component'';

describe(''Component'', () => {
  const defaultProps = {
    title: ''Test Title'',
    description: ''Test Description''
  };

  it(''renders with required props'', () => {
    render(<Component {...defaultProps} />);
    
    expect(screen.getByText(''Test Title'')).toBeInTheDocument();
    expect(screen.getByText(''Test Description'')).toBeInTheDocument();
  });

  it(''handles optional props correctly'', () => {
    render(<Component title="Test" />);
    
    expect(screen.getByText(''Test'')).toBeInTheDocument();
    expect(screen.queryByText(''Test Description'')).not.toBeInTheDocument();
  });

  it(''calls onClick when button is clicked'', () => {
    const mockOnClick = jest.fn();
    render(<Component {...defaultProps} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole(''button''));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
```

## Best Practices
- Test component behavior, not implementation
- Use meaningful test descriptions
- Mock external dependencies
- Test edge cases and error scenarios
- Keep tests focused and isolated',
    ARRAY['testing', 'jest', 'react-testing-library'],
    'Testing',
    'Jest',
    18,
    10
);

-- Database Query Pattern
INSERT INTO cursor_rules (
    name, 
    description, 
    pattern, 
    rule_content, 
    tags, 
    category, 
    framework, 
    downloads, 
    likes
) VALUES (
    'Database Query Pattern',
    'Safe database operations with proper error handling and connection management',
    'src/db/**/*.js',
    '# Database Query Pattern

When working with databases:

## Security First
- Always use parameterized queries
- Validate and sanitize all inputs
- Implement proper access controls
- Use connection pooling

## Query Template
```javascript
const getUserById = async (userId) => {
  try {
    // Validate input
    if (!userId || typeof userId !== ''string'') {
      throw new Error(''Invalid user ID'');
    }

    // Use parameterized query
    const query = ''SELECT * FROM users WHERE id = $1'';
    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];

  } catch (error) {
    console.error(''Database error:'', error);
    throw new Error(''Failed to fetch user'');
  }
};
```

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
- Implement proper error handling',
    ARRAY['database', 'sql', 'security'],
    'Database',
    'General',
    9,
    4
);

-- TypeScript Best Practices
INSERT INTO cursor_rules (
    name, 
    description, 
    pattern, 
    rule_content, 
    tags, 
    category, 
    framework, 
    downloads, 
    likes
) VALUES (
    'TypeScript Best Practices',
    'TypeScript patterns for better type safety and code quality',
    '*.ts',
    '# TypeScript Best Practices

When writing TypeScript code:

## Type Definitions
- Always define interfaces for complex objects
- Use type aliases for simple types
- Prefer interfaces over type aliases for objects
- Use union types for multiple possible values

## Interface Template
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: ''light'' | ''dark'';
  notifications: boolean;
  language: string;
}
```

## Function Signatures
```typescript
// Good: Explicit return type
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Good: Generic function
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}
```

## Best Practices
- Use strict mode in tsconfig.json
- Avoid any type when possible
- Use readonly for immutable properties
- Implement proper error handling with custom types
- Use utility types like Partial, Pick, Omit',
    ARRAY['typescript', 'types', 'interfaces'],
    'TypeScript',
    'TypeScript',
    22,
    12
);

-- Security Best Practices
INSERT INTO cursor_rules (
    name, 
    description, 
    pattern, 
    rule_content, 
    tags, 
    category, 
    framework, 
    downloads, 
    likes
) VALUES (
    'Security Best Practices',
    'Essential security patterns for web applications',
    '**/*.{js,ts}',
    '# Security Best Practices

When building web applications:

## Input Validation
- Always validate and sanitize user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Sanitize data before rendering in templates

## Authentication Template
```javascript
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('' '')[1];
    
    if (!token) {
      return res.status(401).json({ error: ''No token provided'' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: ''Invalid token'' });
  }
};
```

## Data Sanitization
```javascript
const sanitizeInput = (input) => {
  return input
    .replace(/[<>]/g, '''') // Remove HTML tags
    .trim()
    .toLowerCase();
};
```

## Security Headers
- Set proper Content Security Policy
- Use HTTPS in production
- Implement rate limiting
- Log security events
- Regular security audits

## Best Practices
- Never trust user input
- Use environment variables for secrets
- Implement proper session management
- Regular dependency updates
- Security testing in CI/CD',
    ARRAY['security', 'authentication', 'validation'],
    'Security',
    'General',
    14,
    7
);

-- Performance Optimization
INSERT INTO cursor_rules (
    name, 
    description, 
    pattern, 
    rule_content, 
    tags, 
    category, 
    framework, 
    downloads, 
    likes
) VALUES (
    'Performance Optimization',
    'Performance patterns for faster applications',
    '**/*.{js,ts,jsx,tsx}',
    '# Performance Optimization

When optimizing application performance:

## React Optimization
- Use React.memo for expensive components
- Implement proper key props in lists
- Use useMemo and useCallback hooks
- Lazy load components and routes

## Code Splitting Template
```javascript
// Lazy load components
const LazyComponent = React.lazy(() => import('./ExpensiveComponent'));

// Lazy load routes
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
```

## Database Optimization
```javascript
// Use indexes for frequently queried fields
// Implement pagination for large datasets
const getUsers = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  return await db.query(
    'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
};
```

## Caching Strategies
- Implement Redis for session storage
- Use CDN for static assets
- Cache API responses when appropriate
- Implement browser caching headers

## Best Practices
- Profile your application regularly
- Use production builds for testing
- Implement proper error boundaries
- Monitor performance metrics
- Optimize bundle size',
    ARRAY['performance', 'optimization', 'caching'],
    'Performance',
    'General',
    11,
    5
); 