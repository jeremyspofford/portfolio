#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting Local Deployment ===${NC}"

# 1. Check for AWS Credentials
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo -e "${RED}Error: AWS credentials not found. Please log in or set AWS_PROFILE.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ AWS Credentials found${NC}"

# 2. Get Infrastructure Config from Terraform
echo -e "${BLUE}Reading Terraform outputs...${NC}"
cd terraform
S3_BUCKET=$(terraform output -raw s3_bucket_name)
CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id)
cd ..

if [ -z "$S3_BUCKET" ] || [ -z "$CLOUDFRONT_ID" ]; then
    echo -e "${RED}Error: Could not read S3 Bucket or CloudFront ID from Terraform outputs.${NC}"
    echo "Make sure you have applied terraform first."
    exit 1
fi

echo -e "Target Bucket: ${GREEN}$S3_BUCKET${NC}"
echo -e "Distribution ID: ${GREEN}$CLOUDFRONT_ID${NC}"

# 3. Build Frontend
echo -e "${BLUE}Building Frontend...${NC}"
cd src
npm install # Install dependencies if needed
npm run build
cd ..

# 4. Sync to S3
echo -e "${BLUE}Syncing to S3...${NC}"
aws s3 sync src/out/ s3://$S3_BUCKET --delete

# 5. Invalidate Cache
echo -e "${BLUE}Invalidating CloudFront Cache...${NC}"
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*" > /dev/null

echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo -e "Configured URL: https://d21d95xbejbzdx.cloudfront.net"
