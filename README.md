# Serverless AI Portfolio

A modern, full-stack portfolio application built with Next.js, AWS Serverless architecture, and AI integration using AWS Bedrock.

## 🏗 Architecture

- **Frontend:** Next.js (React 19), Tailwind CSS, Framer Motion
- **Backend:** AWS Lambda (Node.js), API Gateway
- **Database:** Amazon DynamoDB
- **AI Engine:** AWS Bedrock (Claude 3 Sonnet/Haiku)
- **Infrastructure:** Terraform (IaC)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [AWS CLI](https://aws.amazon.com/cli/) (Configured with credentials)
- [Terraform](https://www.terraform.io/) (v1.0+)

### 1. Infrastructure Setup

Initialize the AWS infrastructure first. This will provision the database, API Gateway, and Lambda functions.

```bash
cd terraform
terraform init
terraform apply
```

**Note:** After `terraform apply` finishes, note the `api_gateway_url` output. You will need this for the frontend.

### 2. Frontend Local Development

1. Navigate to the frontend directory:

   ```bash
   cd src
   ```

2. Create a `.env.local` file to point to your deployed backend:

   ```bash
   echo "NEXT_PUBLIC_API_URL=<YOUR_API_GATEWAY_URL>" > .env.local
   ```

   *Replace `<YOUR_API_GATEWAY_URL>` with the URL from the Terraform output.*

3. Install dependencies and run the development server:

   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Backend Development

The backend logic resides in the `backend/` directory.

- **Handlers:** `backend/handlers/` contains the Lambda function code.
- **Deploy Changes:** To deploy backend changes, run `terraform apply` in the `terraform/` directory. The configuration automatically zips and updates the functions.

## 📦 Deployment

### Automated Deployment Script

A convenience script is provided to build the frontend and sync it to the S3 bucket (hosting).

```bash
./scripts/deploy.sh
```

*Ensure you have run Terraform first, as the script relies on its outputs.*

### Manual Steps

1. **Build Frontend:** `cd src && npm run build`
2. **Sync to S3:** `aws s3 sync src/out/ s3://<YOUR_BUCKET_NAME> --delete`
3. **Invalidate Cache:** `aws cloudfront create-invalidation --distribution-id <YOUR_DIST_ID> --paths "/*"`

## 🗃 Data Seeding

To populate your DynamoDB table with initial data:

```bash
cd scripts
node seed_data.js
```

*(You may need to configure the script with your specific table name or region if not automatically detected).*

## 🛠 Project Structure

```markdown
├── backend/        # AWS Lambda handlers (Node.js)
├── scripts/        # Deployment and utility scripts
├── src/            # Next.js frontend application
└── terraform/      # Infrastructure as Code definitions
```
