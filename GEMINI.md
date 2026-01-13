# Project Context

## Overview

This is a full-stack portfolio application featuring a static frontend hosted on AWS S3/CloudFront and a dynamic serverless backend on AWS Lambda.

### Architecture

- **Frontend:** Next.js (Static Export), React, Tailwind CSS, Framer Motion.
- **Backend:** Node.js AWS Lambda functions (managed via Terraform).
- **Database:** AWS DynamoDB (`portfolio-content`).
- **AI Integration:** AWS Bedrock (Claude 3 Sonnet/Haiku) for content enhancement.
- **Infrastructure:** Terraform for all AWS resources (S3, CloudFront, API Gateway, Lambda, DynamoDB).
- **Deployment:** Shell scripts for frontend syncing; Terraform for backend updates.

## Directory Structure

- `src/`: Next.js frontend application.
- `backend/`: Node.js Lambda handlers and logic.
- `terraform/`: Infrastructure as Code (IaC) definitions.
- `scripts/`: Utility scripts for deployment and data seeding.
- `.github/workflows/`: CI/CD pipelines.

## Development

### Frontend (`src/`)

- **Run Locally:** `npm run dev` (starts on <http://localhost:3000>)
- **Build:** `npm run build` (outputs to `out/` directory for static hosting)
- **Lint:** `npm run lint`

### Backend (`backend/`)

- Handlers are located in `handlers/`.
- Code is deployed to AWS Lambda via Terraform.
- **Note:** Changes to backend code require a Terraform apply to update the Lambda zip file.

### Infrastructure (`terraform/`)

- **Init:** `terraform init`
- **Plan:** `terraform plan`
- **Apply:** `terraform apply`
- **Key Resources:**
  - `lambda.tf`: Zips `backend/` directory and deploys functions.
  - `main.tf`: Core setup.

## Deployment

### Full Deployment

Use the provided script to deploy the frontend (requires AWS credentials):

```bash
./scripts/deploy.sh
```

This script:

1. Checks AWS credentials.
2. Reads Terraform outputs for S3 bucket and CloudFront ID.
3. Builds the Next.js frontend (`npm run build`).
4. Syncs the `out/` directory to the S3 bucket.
5. Invalidates the CloudFront cache.

### Backend Updates

To update backend logic (Lambda functions):

1. Navigate to `terraform/`.
2. Run `terraform apply`.
   - The configuration is set up to automatically re-zip the `backend/` directory and update the Lambda function code if changes are detected.

## Conventions

- **Styling:** Tailwind CSS.
- **Components:** Functional React components with TypeScript.
- **State Management:** React hooks.
- **Content:** MDX for static blog posts (`src/content/posts`).
- **Type Safety:** TypeScript used throughout frontend and recommended for backend interactions.
