#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Migrating Terraform State from default to stage ===${NC}"

cd terraform

# 1. Init
echo -e "${BLUE}Initializing Terraform...${NC}"
terraform init -input=false

# 2. Select Default and Pull State
echo -e "${BLUE}Pulling state from 'default' workspace...${NC}"
terraform workspace select default
terraform state pull > default.tfstate

# 3. Create/Select Stage Workspace
echo -e "${BLUE}Switching to 'stage' workspace...${NC}"
terraform workspace select stage || terraform workspace new stage

# 4. Push State to Stage
echo -e "${BLUE}Pushing state to 'stage' workspace...${NC}"
terraform state push default.tfstate

# 5. Verify
echo -e "${GREEN}Migration complete! 'stage' workspace now contains the infrastructure state.${NC}"
echo -e "You can verify by running: terraform workspace select stage && terraform show"

# Cleanup
rm default.tfstate
cd ..
