# Coding Practices

> **Trigger:** Always-on (applies to all TypeScript/JavaScript operations)
> **Applies to:** `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`

This document outlines general coding practices and standards to be followed across the codebase.

## TypeScript Standards

### Strict Type Safety: No `any`

**NEVER use the `any` type in TypeScript.**

- The `any` type defeats the purpose of TypeScript's type system
- If the type is truly unknown and you intended to use `any`, use `unknown` instead
- `unknown` forces you to perform type checking before operating on the value, ensuring safety

**Incorrect:**

```typescript
function processData(data: any) {
  return data.value; // Unsafe access
}
```

**Correct:**

```typescript
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value; // Safe access with checks
  }
  throw new Error("Invalid data format");
}
```

### Type Definitions

- Prefer `interface` over `type` for object definitions to allow for better extensibility and error messages
- Place shared types in `apps/shared/types/` if they are used by both frontend and backend
