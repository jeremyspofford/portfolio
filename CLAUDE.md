# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (src/)
```bash
# Dev server
npm run dev                          # or ./scripts/dev.sh (installs deps + starts)

# Build (static export to src/out/)
npm run build

# Tests (Vitest + jsdom)
cd src && npx vitest                 # watch mode
cd src && npx vitest run             # single run
cd src && npx vitest run __tests__/components/SomeComponent.test.tsx  # single file

# Lint
cd src && npx eslint .
```

### Backend (backend/)
```bash
cd backend && npm test               # Jest
```

### Infrastructure
```bash
cd terraform && terraform plan
cd terraform && terraform apply
```

## Architecture

### Static-export Next.js + AWS serverless

The frontend is a **statically exported** Next.js site (`output: 'export'` in next.config.ts). There is no Next.js server at runtime — the build produces flat HTML/JS/CSS in `src/out/`, deployed to **Cloudflare Pages**.

Dynamic features (AI, feature flags) go through a separate **AWS API Gateway + Lambda** backend. The frontend calls `NEXT_PUBLIC_API_URL` at runtime for these.

### Content system: YAML files, not a database

Portfolio content (profile, experience, projects, skills, certifications) lives in `src/data/` as YAML files, read at **build time** by `src/lib/content.ts` using `fs`/`js-yaml`. This replaced the original DynamoDB-backed content fetch. The `src/lib/api.ts` file still defines all TypeScript interfaces (`ContentItem<T>`, `ProfileContent`, etc.) and the AI-related API calls (`enhanceContent`, `analyzeJobPosting`).

Blog posts are Markdown with gray-matter frontmatter in `src/content/posts/`, processed by `src/lib/blog.ts`.

### Feature flags via AWS AppConfig

`src/lib/featureFlags.tsx` provides a React context that fetches flags from the API at runtime. When `NEXT_PUBLIC_API_URL` is unset, defaults are used. The backend handler (`backend/handlers/get_feature_flags.js`) reads from AWS AppConfig. Key flags: `showAIShowcase`, `showContributions`, `showResumeDownload`, `enableJobFitAnalyzer`, `enableJobFitUrl`.

### Backend Lambda handlers

`backend/handlers/` contains four Lambda functions:
- `get_content.js` — DynamoDB content fetch (legacy, frontend now uses YAML)
- `enhance_content.js` — AWS Bedrock AI for resume enhancement and job matching
- `get_feature_flags.js` — AppConfig feature flag retrieval
- `sync_contributions.js` — GitHub contribution data sync

Backend uses CommonJS (`"type": "commonjs"`) with `@aws-sdk/client-bedrock-runtime`.

### Terraform infrastructure

`terraform/` provisions: API Gateway (`api_gateway.tf`), Lambda functions (`lambda.tf`), S3 + CloudFront (`s3_cloudfront.tf`), Route53 + ACM (`route53_acm.tf`), AppConfig for feature flags (`appconfig.tf`), GitHub OIDC for CI (`github_oidc.tf`), EventBridge schedules (`events.tf`).

### CI/CD

- **Deploy**: `.github/workflows/deploy-cloudflare.yml` — pushes to `main` trigger build + deploy to Cloudflare Pages
- **Agent fleet**: `.github/workflows/agent-fleet.yml` — autonomous review agents defined in `.claude/agents/` (security, performance, architecture, API quality, frontend quality, test coverage, dependency health)

## Key Conventions

- **Package manager**: The root uses npm workspaces (`"workspaces": ["src"]`). The `src/` directory has a `pnpm-lock.yaml` — use `npm ci` or `npm install` from root, or `pnpm install` from within `src/`.
- **Dark mode only**: Theme is forced to dark via `next-themes` (`forcedTheme="dark"`). Don't add light mode variants.
- **Font stack**: Space Grotesk (display), Inter Tight (body), JetBrains Mono (code) — loaded via `next/font/google` CSS variables.
- **Tailwind brand colors**: Use the semantic tokens (`bg-primary`, `bg-secondary`, `brand-accent`, etc.) defined in `tailwind.config.js`, not raw color values.
- **Path alias**: `@/` maps to `src/` root (configured in tsconfig.json and vitest.config.ts).
- **Static export constraints**: No server-side features (middleware, API routes, dynamic server rendering). All pages must be statically exportable.

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
