---
trigger: always
description: General coding principles for all agents to adhere to.
---

# Coding Practices

This document outlines general coding practices and standards to be followed across the codebase by all AI agents.

## TypeScript Standards

### Strict Type Safety: No `any`

**NEVER use the `any` type in TypeScript. This rule has NO exceptions.**

- The `any` type defeats TypeScript's type system entirely
- Use `unknown` when the type is truly unknown
- `unknown` forces proper type checking before use

**❌ Incorrect:**

```typescript
function processData(data: any) {
  return data.value; // Unsafe - no type checking
}

const items: any[] = fetchItems(); // Unsafe array
```

**✅ Correct:**

```typescript
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data format');
}

// Or with type guards
function isDataWithValue(data: unknown): data is { value: string } {
  return typeof data === 'object' && data !== null && 'value' in data;
}

function processDataSafe(data: unknown) {
  if (isDataWithValue(data)) {
    return data.value; // Fully typed
  }
  throw new Error('Invalid data format');
}
```

### Type Definitions

- **Prefer `interface` over `type`** for object definitions
  - Better extensibility via declaration merging
  - Clearer error messages
  - Use `type` only for unions, intersections, or primitives
- **Place shared types** in `apps/shared/types/` for cross-app usage

**❌ Incorrect:**

```typescript
type User = {
  id: string;
  name: string;
};
```

**✅ Correct:**

```typescript
interface User {
  id: string;
  name: string;
}

// Use type for unions/intersections
type UserRole = 'admin' | 'user' | 'guest';
type UserWithRole = User & { role: UserRole };
```

---

## Naming Conventions

### Variables and Functions

- **camelCase** for variables, functions, and methods
- **PascalCase** for classes, interfaces, types, and React components
- **SCREAMING_SNAKE_CASE** for constants and environment variables
- **Descriptive names** - avoid abbreviations

**❌ Incorrect:**

```typescript
const u = getUser(); // Unclear
const usrData = fetchUsrData(); // Abbreviations
const DATA = mutableData; // CAPS for mutable
function prc(d: Data) {} // Unclear
```

**✅ Correct:**

```typescript
const user = getUser();
const userData = fetchUserData();
const MAX_RETRIES = 3; // Constant
function processData(data: Data) {}
```

### Boolean Naming

- Prefix with `is`, `has`, `can`, `should`, `will`

```typescript
const isLoading = true;
const hasPermission = checkPermission();
const canEdit = user.role === 'admin';
const shouldRefetch = isStale && isVisible;
```

---

## Function Standards

### Pure Functions Preferred

- Functions should not mutate arguments
- Avoid side effects where possible
- Return new objects instead of modifying

**❌ Incorrect:**

```typescript
function addItem(items: Item[], newItem: Item) {
  items.push(newItem); // Mutates input
  return items;
}
```

**✅ Correct:**

```typescript
function addItem(items: readonly Item[], newItem: Item): Item[] {
  return [...items, newItem]; // Returns new array
}
```

### Error Handling

- Use custom error classes for domain errors
- Always type catch blocks with `unknown`
- Never swallow errors silently

**❌ Incorrect:**

```typescript
try {
  await riskyOperation();
} catch (e) {
  console.log(e.message); // e is 'unknown'
}

try {
  await anotherOperation();
} catch {
  // Swallowed error
}
```

**✅ Correct:**

```typescript
try {
  await riskyOperation();
} catch (error: unknown) {
  if (error instanceof CustomError) {
    logger.error('Custom error:', error.message);
  } else if (error instanceof Error) {
    logger.error('Unexpected error:', error.message);
  } else {
    logger.error('Unknown error:', error);
  }
  throw error; // Re-throw or handle appropriately
}
```

---

## Async/Await Standards

### Always Use Async/Await

- Prefer `async/await` over `.then()` chains
- Use `Promise.all()` for parallel operations
- Always handle rejections

**❌ Incorrect:**

```typescript
function fetchData() {
  return fetch('/api/data')
    .then(res => res.json())
    .then(data => processData(data))
    .catch(err => console.log(err));
}
```

**✅ Correct:**

```typescript
async function fetchData(): Promise<ProcessedData> {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return processData(data);
  } catch (error: unknown) {
    logger.error('Failed to fetch data:', error);
    throw error;
  }
}

// Parallel operations
async function fetchAllData(): Promise<[Users, Products]> {
  return Promise.all([
    fetchUsers(),
    fetchProducts(),
  ]);
}
```

---

## Import/Export Standards

### Named Exports Preferred

- Use named exports over default exports
- Enables better IDE support and refactoring
- Exception: React page components for Next.js

**❌ Incorrect:**

```typescript
// user.service.ts
export default class UserService {}

// usage
import UserService from './user.service'; // Can be renamed arbitrarily
```

**✅ Correct:**

```typescript
// user.service.ts
export class UserService {}

// usage
import { UserService } from './user.service';
```

### Import Organization

Imports should be organized in this order (enforced by Prettier plugin):

1. External dependencies (node_modules)
2. Internal aliases (`@/`, `~/`)
3. Relative imports (parent `../`, then current `./`)

---

## Null/Undefined Handling

### Prefer Null Checks

- Use nullish coalescing (`??`) over logical OR (`||`)
- Use optional chaining (`?.`) for nested access
- Be explicit about null vs undefined

**❌ Incorrect:**

```typescript
const name = user.name || 'Anonymous'; // Treats '' and 0 as falsy
const city = user && user.address && user.address.city;
```

**✅ Correct:**

```typescript
const name = user.name ?? 'Anonymous'; // Only null/undefined
const city = user?.address?.city;
const port = config.port ?? 3000; // 0 is valid
```

---

## Comments and Documentation

### JSDoc for Public APIs

- Document all exported functions, classes, and interfaces
- Include parameter descriptions and return types
- Add examples for complex functions

```typescript
/**
 * Calculates the total price including tax and discounts.
 *
 * @param items - Array of cart items to calculate
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @param discount - Optional discount to apply
 * @returns The total price after tax and discounts
 *
 * @example
 * const total = calculateTotal(items, 0.08, { type: 'percent', value: 10 });
 */
export function calculateTotal(
  items: CartItem[],
  taxRate: number,
  discount?: Discount,
): number {
  // Implementation
}
```

### Avoid Obvious Comments

```typescript
// ❌ Bad - obvious
const count = 0; // Initialize count to zero

// ✅ Good - explains why
const count = 0; // Start from zero to exclude header row
```

---

## Integration with AI Assistants

All AI coding assistants (Cursor, Claude, Anthropic, Gemini) MUST:

- **Never generate `any` types** - use `unknown` with type guards
- **Use `interface` for objects** - `type` only for unions/primitives
- **Follow naming conventions** - camelCase, PascalCase, etc.
- **Prefer immutability** - return new objects, use `readonly`
- **Handle errors properly** - type catch as `unknown`, never swallow
- **Use async/await** - avoid `.then()` chains
- **Prefer named exports** - over default exports
- **Document public APIs** - JSDoc for exported functions
