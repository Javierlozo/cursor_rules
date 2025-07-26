# React Component Development Patterns

## Rule Name
React Component Best Practices

## Description
This rule enforces React component development best practices including proper TypeScript typing, component structure, prop handling, and performance optimizations.

## Pattern
```typescript
// React component with TypeScript
interface ComponentProps {
  // Props interface
}

const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    // JSX
  );
};

export default ComponentName;
```

## Rule Content
```typescript
// React Component Development Best Practices

// 1. Always use TypeScript interfaces for props
interface ComponentProps {
  // Define all props with proper types
  title: string;
  description?: string; // Optional props use ?
  onClick: (id: string) => void;
  children?: React.ReactNode;
  className?: string;
}

// 2. Use React.FC for functional components
const ComponentName: React.FC<ComponentProps> = ({
  title,
  description,
  onClick,
  children,
  className = '', // Default values
}) => {
  // 3. Use proper state management
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataType | null>(null);

  // 4. Use useCallback for event handlers
  const handleClick = useCallback((id: string) => {
    setIsLoading(true);
    onClick(id);
  }, [onClick]);

  // 5. Use useEffect for side effects
  useEffect(() => {
    // Side effect logic
    return () => {
      // Cleanup logic
    };
  }, [/* dependencies */]);

  // 6. Use proper error boundaries
  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 7. Use semantic HTML and accessibility
  return (
    <div className={`component ${className}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <button
        onClick={() => handleClick('id')}
        aria-label={`Click to ${title}`}
        disabled={isLoading}
      >
        {children}
      </button>
    </div>
  );
};

// 8. Always export as default
export default ComponentName;

// 9. Export types for reuse
export type { ComponentProps };
```

## Tags
React, TypeScript, Components, Best Practices, Performance, Accessibility

## Category
React

## Framework
React

## File References
- React documentation: https://react.dev/
- TypeScript handbook: https://www.typescriptlang.org/docs/
- React patterns: https://reactpatterns.com/
```

## Usage Examples

### Basic Component
```typescript
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {text}
    </button>
  );
};

export default Button;
```

### Form Component
```typescript
interface FormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

const Form: React.FC<FormProps> = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState<FormData>(initialData);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};

export default Form;
```

## Best Practices Checklist

- ✅ Use TypeScript interfaces for all props
- ✅ Use React.FC type for functional components
- ✅ Provide default values for optional props
- ✅ Use useCallback for event handlers
- ✅ Use useEffect for side effects with proper cleanup
- ✅ Handle loading and error states
- ✅ Use semantic HTML and accessibility attributes
- ✅ Export component as default
- ✅ Export types for reuse
- ✅ Use proper naming conventions
- ✅ Keep components focused and single-purpose
- ✅ Use proper state management patterns 