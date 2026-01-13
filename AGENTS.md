# AGENTS.md - Guidelines for Coding Agents

This document provides build commands and code style guidelines for agentic coding agents working in this repository.

## Build, Lint, and Test Commands

### Frontend (src/ directory)

```bash
cd src
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build static export to src/out/
npm run start        # Serve production build locally
npm run lint         # Run ESLint
```

### Backend (backend/ directory)

```bash
cd backend
npm test             # No test framework configured (returns error)
```

### Infrastructure (terraform/ directory)

```bash
cd terraform
terraform init       # Initialize (required first time)
terraform plan       # Preview infrastructure changes
terraform apply      # Apply infrastructure changes
terraform output     # View outputs (bucket name, CloudFront ID, API endpoint)
```

### Full Deployment

```bash
./scripts/deploy.sh  # Build frontend + sync to S3 + invalidate CloudFront
```

### Running Individual Tests

No test framework is currently configured. Manual testing is performed via:

- AWS Console for Lambda functions
- Local dev server for frontend components
- API endpoint testing with tools like curl or Postman

## Code Style Guidelines

### Import Ordering

1. React imports: `import { useEffect, useState } from 'react';`
2. Third-party libraries: `import { Github } from 'lucide-react';`
3. Internal imports (use `@/` alias): `import { fetchContent } from '@/lib/api';`
4. Separate groups with blank lines
5. Client components start with `"use client";` at the top

### Formatting & Indentation

- 2-space indentation
- No explicit Prettier config (use ESLint defaults)
- Semicolons on statements, optional on imports
- Max line length: not strictly enforced, prefer readability
- Trailing commas in objects/arrays for consistency

### TypeScript Usage

- Strict mode enabled in tsconfig.json
- Define interfaces for all component props: `interface HeroProps { ... }`
- Use generics for flexible data structures: `ContentItem<T>`
- Type assertions only when necessary: `const Icon = icons[name] as ComponentType;`
- Avoid `any` - prefer `unknown` or proper types
- Use exported interfaces for shared types in lib/

### Naming Conventions

- **Components**: PascalCase, e.g., `Hero`, `ExperienceTimeline`, `ChatInterface`
- **Functions**: camelCase, e.g., `fetchContent()`, `getIcon()`, `getAllPosts()`
- **Variables**: camelCase, e.g., `bootSequenceComplete`, `activeCerts`
- **Constants**: UPPER_SNAKE_CASE, e.g., `TABLE_NAME`, `API_URL`
- **Interfaces**: PascalCase, prefix with type name if needed, e.g., `SkillContent`, `ContentItem<T>`
- **Files**:
  - Components: `PascalCase.tsx` (e.g., `Hero.tsx`)
  - Utilities: `camelCase.ts` (e.g., `api.ts`, `utils.ts`, `blog.ts`)
  - Blog posts: `kebab-case.mdx` (e.g., `terraform-in-2024.mdx`)

### Error Handling Patterns

- **Frontend async functions**: Return fallback values, log errors

  ```typescript
  export async function fetchContent(section: string): Promise<ContentItem<any>[]> {
    if (!API_URL) {
      console.warn("API_URL is not defined");
      return []; // Graceful degradation
    }
    try {
      const res = await fetch(`${API_URL}/content?section=${section}`, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error("Failed to fetch content");
      return res.json();
    } catch (error) {
      console.error(`Error fetching ${section}:`, error);
      return []; // Return empty array on error
    }
  }
  ```

- **Backend Lambda handlers**: Try-catch with structured error responses

  ```javascript
  exports.handler = async (event) => {
    try {
      // Handler logic
      return { statusCode: 200, body: JSON.stringify(data) };
    } catch (error) {
      console.error("Error:", error);
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
  };
  ```

### Component Architecture

- **Default to Server Components**: No `"use client"` unless interactive
- **Props Interface**: Always define, export if reused
- **Helper Functions**: Define outside component or in separate utility file
- **Conditional Rendering**: Use null checks, avoid nested ternaries
- **Lists**: Always provide unique `key` prop (use stable IDs like `item.SK`, not array indices)

### React Patterns

- Use React 19 features (functional components, hooks)
- State management: `useState` for local state, no global state library
- Side effects: `useEffect` with proper dependency arrays
- Avoid prop drilling: Use `fetchContent` directly in server components
- Client components: Minimize, only for interactivity (forms, animations, chat)

### Styling with Tailwind CSS

- Use utility classes from Tailwind CSS v3
- Combine classes with `cn()` helper (clsx + tailwind-merge)
- Responsive design: `md:`, `lg:` prefixes for breakpoints
- Dark mode: `dark:` prefix, uses `next-themes` provider
- Theme colors: Use CSS custom properties via config (primary, secondary, accent, muted)
- Example: `className="text-foreground hover:text-primary transition-colors"`

### API Integration

- **Fetch API**: Use native fetch with Next.js revalidation

  ```typescript
  fetch(`${API_URL}/endpoint`, { next: { revalidate: 60 } })
  ```

- **POST requests**: Include `Content-Type: application/json` header
- **Environment variables**: Use `process.env.NEXT_PUBLIC_*` for client access
- **API URL**: Configured in `src/.env.local` or injected at build time

### DynamoDB/Data Patterns

- **Table**: `portfolio-content` with PK (Partition Key) and SK (Sort Key)
- **Section Types**: `PROFILE`, `EXPERIENCE`, `SKILL`, `CERTIFICATION`
- **Content**: JSON blob in `content` attribute
- **Query patterns**: Use `QueryCommand` for PK-based, `ScanCommand` for full table

### Blog/Content Structure

- **Posts**: MDX files in `src/src/content/posts/` with frontmatter
- **Required frontmatter**: `title`, `date`, `description`, `tags`
- **Optional frontmatter**: `image`
- **Parsing**: Use `gray-matter` for frontmatter extraction
- **Rendering**: `next-mdx-remote` with plugins (rehype-highlight, remark-gfm)

### Configuration

- **Feature flags**: Centralized in `src/src/config.ts`
- **Env vars**:
  - `NEXT_PUBLIC_API_URL`: API Gateway endpoint
  - `NEXT_PUBLIC_SITE_URL`: Public site URL
  - `NEXT_PUBLIC_GA_ID`: Google Analytics ID
  - `NEXT_PUBLIC_SHOW_RESUME_DOWNLOAD`: Toggle resume download
  - `NEXT_PUBLIC_SHOW_CONTRIBUTIONS`: Toggle contributions section
  - `NEXT_PUBLIC_ENABLE_AI`: Toggle AI chat interface

### File Structure Patterns

```
src/
  src/
    components/     # React components (PascalCase.tsx)
    lib/           # Utilities and API clients (camelCase.ts)
    app/           # Next.js app router pages and layouts
    config.ts      # Centralized configuration
  package.json
  tsconfig.json
  next.config.ts   # Static export config (output: 'export')

backend/
  handlers/        # Lambda functions (camelCase.js)
  package.json

terraform/
  *.tf            # Infrastructure as code
```

### Static Export Constraints

- **No dynamic routes at runtime**: All routes pre-rendered at build time
- **No Image Optimization**: `images.unoptimized: true` in next.config.ts
- **Trailing slashes**: `trailingSlash: true` for S3/CloudFront compatibility
- **API calls**: Build-time (SSG) or client-side only

### Testing & Verification

Before deploying changes:

1. Run `npm run lint` in src/ to check for ESLint errors
2. Run `npm run build` in src/ to ensure static export succeeds
3. Run `terraform plan` in terraform/ to preview infrastructure changes
4. Manually test key features in dev server
5. Verify API responses if backend changes were made

### Important Reminders

- **No test framework**: Manual testing required
- **Git hooks**: Not configured, run lint/build before pushing
- **CORS**: API Gateway returns `*` origin (configure stricter for production)
- **State management**: No global library (React context for theme only)
- **Icons**: Use `lucide-react` for consistent iconography
