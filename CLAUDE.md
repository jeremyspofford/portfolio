# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a personal portfolio website built with a **hybrid static/serverless architecture**:

### Frontend (Next.js Static Export)

- **Location**: `src/` directory
- **Framework**: Next.js 16+ with App Router, React 19, TypeScript
- **Build**: Static export (`output: 'export'`) deployed to S3 + CloudFront
- **Styling**: Tailwind CSS with dark mode support (next-themes)
- **Components**: React components in `src/src/components/`
- **Content Types**:
  - **Dynamic content** (profile, experience, skills, certifications): Fetched from AWS API Gateway → Lambda → DynamoDB
  - **Blog posts**: Static MDX files in `src/src/content/posts/` with frontmatter (gray-matter)
  - **Contributions**: GitHub/GitLab API data via serverless backend

### Backend (AWS Serverless)

- **Location**: `backend/handlers/`
- **Runtime**: Node.js Lambda functions
- **API**: AWS API Gateway HTTP API
- **Database**: DynamoDB table (`portfolio-content`) with PK/SK pattern
- **Lambdas**:
  - `get_content.js`: Query/scan content by section (PROFILE, EXPERIENCE, SKILL, CERTIFICATION)
  - `enhance_content.js`: AI-powered content enhancement using AWS Bedrock
  - `sync_contributions.js`: Scheduled sync of GitHub/GitLab contributions

### Infrastructure (Terraform)

- **Location**: `terraform/` directory
- **State**: Remote S3 backend (`portfolio-tf-state-jeremyspofford`, us-east-1)
- **Resources**: S3 bucket, CloudFront distribution, Lambda functions, API Gateway, DynamoDB, EventBridge Scheduler, GitHub OIDC provider
- **Region**: us-east-1

## Development Commands

### Frontend Development

```bash
cd src
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build static export to src/out/
npm run start        # Serve production build locally
npm run lint         # Run ESLint
```

### Terraform Operations

```bash
cd terraform
terraform init       # Initialize (required first time)
terraform plan       # Preview changes
terraform apply      # Apply infrastructure changes
terraform output     # View outputs (bucket name, CloudFront ID, API endpoint)
```

### Full Deployment (Local)

```bash
./scripts/deploy.sh  # Build frontend + sync to S3 + invalidate CloudFront
```

**Note**: Requires AWS credentials and applied Terraform infrastructure.

### CI/CD Deployment

- **Trigger**: Push to `main` branch or manual workflow dispatch
- **Workflow**: `.github/workflows/deploy.yml`
- **Steps**: Terraform apply → Build frontend with API URL → S3 sync → CloudFront invalidation
- **Auth**: GitHub OIDC with AWS IAM role (no static credentials)

### Data Management

```bash
cd scripts
node seed_data.js    # Seed DynamoDB with initial portfolio content
```

## Code Structure

### Frontend Application Flow

1. **Page**: `src/src/app/page.tsx` (homepage)
   - Parallel data fetching: `fetchContent()` for DynamoDB content + `getAllPosts()` for blog posts
   - Renders: Hero → About → Contributions → Skills → Certifications → Experience → Latest Posts → Contact → Chat

2. **Blog**: `src/src/app/blog/`
   - List: `page.tsx` with search functionality (`SearchPosts` component)
   - Post: `[slug]/page.tsx` renders MDX with `next-mdx-remote`
   - RSS: `src/src/app/feed.xml/route.ts` generates RSS feed

3. **Resume**: `src/src/app/resume/page.tsx`
   - Displays experience, skills, certifications
   - Optional AI-enhanced download (if `NEXT_PUBLIC_SHOW_RESUME_DOWNLOAD=true`)

### Key Libraries

- **gray-matter**: Parse MDX frontmatter in blog posts
- **next-mdx-remote**: Server-side MDX rendering with rehype/remark plugins
- **rehype-highlight**: Code syntax highlighting in blog posts
- **framer-motion**: Animations
- **lucide-react**: Icon library
- **@radix-ui**: Accessible UI primitives (dropdown menus)
- **date-fns**: Date formatting
- **react-activity-calendar**: GitHub-style contribution calendar

### Configuration

- **Environment Variables** (`.env.local` in `src/`):
  - `NEXT_PUBLIC_API_URL`: API Gateway endpoint (injected during CI/CD build)
  - `NEXT_PUBLIC_SITE_URL`: Public site URL for sitemap/RSS
  - `NEXT_PUBLIC_GA_ID`: Google Analytics ID
  - `NEXT_PUBLIC_SHOW_RESUME_DOWNLOAD`: Toggle resume download feature
  - `NEXT_PUBLIC_SHOW_CONTRIBUTIONS`: Toggle contributions section
  - `NEXT_PUBLIC_ENABLE_AI`: Toggle AI chat interface
  - `GITHUB_TOKEN`, `GITLAB_TOKEN`: For contributions sync

- **Config File**: `src/src/config.ts` centralizes feature flags and URLs

### DynamoDB Schema

- **Table**: `portfolio-content`
- **Keys**:
  - `PK` (Partition Key): Section type (e.g., "PROFILE", "EXPERIENCE", "SKILL", "CERTIFICATION")
  - `SK` (Sort Key): Item identifier (e.g., "MAIN", "AWS", "TERRAFORM")
- **Content**: JSON blob in `content` attribute
- **Example**:
  - `PK=PROFILE, SK=MAIN` → Main profile content (name, title, bio, email, socials)
  - `PK=EXPERIENCE, SK=AWS` → AWS experience entry
  - `PK=SKILL, SK=CLOUD` → Cloud skills category

### Blog Post Structure

- **Files**: `src/src/content/posts/*.mdx`
- **Frontmatter**:

  ```yaml
  ---
  title: "Post Title"
  date: "YYYY-MM-DD"
  description: "Brief description"
  tags: ["tag1", "tag2"]
  image: "/images/hero.jpg"  # Optional
  ---
  ```

- **Content**: MDX body with React components support
- **Rendering**: `next-mdx-remote` with plugins (remark-gfm, rehype-slug, rehype-autolink-headings, rehype-highlight)

## Important Patterns

### Static Export Constraints

- **No Dynamic Routes at Runtime**: All routes pre-rendered at build time
- **No Image Optimization**: `images.unoptimized: true` in `next.config.ts`
- **Trailing Slashes**: `trailingSlash: true` for S3/CloudFront compatibility
- **API Calls**: Only during build time (SSG) or client-side

### Data Fetching Strategy

- **Build-time**: `fetchContent()` in server components (cached with `next: { revalidate: 60 }`)
- **Client-side**: ChatInterface uses fetch to Lambda endpoint
- **Blog**: File-system reads during build (no API)

### Deployment Flow

1. **Infrastructure**: Terraform provisions AWS resources
2. **Build**: Next.js static export with injected API_URL
3. **Deploy**: S3 sync with `--delete` flag
4. **Refresh**: CloudFront invalidation (`/*`)

### Lambda Packaging

- **Source**: `backend/handlers/*.js`
- **Bundling**: Terraform archives handlers into `terraform/dist/*.zip`
- **Dependencies**: Installed in `backend/node_modules` (AWS SDK v3)

## Testing Strategy

- **Frontend**: No test framework currently configured
- **Backend**: Manual testing via AWS console or local invocation
- **Infrastructure**: Terraform plan before apply

## Common Tasks

### Adding a New Blog Post

1. Create `src/src/content/posts/my-post.mdx` with frontmatter
2. Run `npm run build` in `src/` to validate
3. Commit and push to `main` (auto-deploys via GitHub Actions)

### Updating Portfolio Content

1. Modify DynamoDB items via AWS console or seed script
2. Frontend will fetch updated content on next build or client-side refresh

### Adding a New Lambda Function

1. Create handler in `backend/handlers/new_handler.js`
2. Add Lambda resource in `terraform/lambda.tf`
3. Add API Gateway integration/route in `terraform/api_gateway.tf`
4. Run `terraform apply` and update frontend API client

### Modifying Infrastructure

1. Edit `.tf` files in `terraform/`
2. Run `terraform plan` to preview changes
3. Run `terraform apply` (requires AWS credentials)
4. Update `.env.local` if outputs change (e.g., new API endpoint)

### Local Frontend Development with Backend

- Set `NEXT_PUBLIC_API_URL` to deployed API Gateway endpoint in `src/.env.local`
- Or mock API responses for offline development

## SEO and Metadata

- **Sitemap**: `src/src/app/sitemap.ts` (dynamic, includes blog posts)
- **Robots**: `src/src/app/robots.ts`
- **RSS**: `src/src/app/feed.xml/route.ts`
- **Analytics**: Google Analytics via `GoogleAnalytics` component (gtag.js)

## Notes

- **Monorepo Structure**: Frontend (`src/`), backend (`backend/`), infrastructure (`terraform/`), scripts (`scripts/`)
- **No Hot Reload for Content**: DynamoDB changes require API revalidation; blog changes require rebuild
- **CORS**: API Gateway returns `Access-Control-Allow-Origin: *` (configure stricter for production)
- **State Management**: No global state library (React context for theme only)
