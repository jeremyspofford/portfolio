# Terraform Workspaces Guide

This project uses **Terraform Workspaces** to manage multiple environments (`stage`, `prod`) infrastructure within the same configuration.

## Workspaces Overview

- **default**: Not used.
- **stage**: Deploys to `stage.jeremyspofford.dev`.
- **prod**: Deploys to `jeremyspofford.dev` (Production).

The active workspace determines the state file (`env/<workspace>/terraform.tfstate`) and the values for environment-specific variables.

## Managing Workspaces Locally

### 1. Initialize Terraform
```bash
cd terraform
terraform init
```

### 2. List Workspaces
```bash
terraform workspace list
```

### 3. Create/Select a Workspace
To switch to the **stage** environment:
```bash
terraform workspace select stage
# If it doesn't exist yet:
terraform workspace new stage
```

To switch to **prod**:
```bash
terraform workspace select prod
# If it doesn't exist yet:
terraform workspace new prod
```

### 4. Apply Changes
When applying changes locally, ensure you are in the correct workspace. You must also provide the required variables matching that environment.

**Deploy to Stage:**
```bash
terraform workspace select stage
terraform apply -var="environment=stage" -var="domain_name=stage.jeremyspofford.dev"
```

**Deploy to Prod:**
```bash
terraform workspace select prod
terraform apply -var="environment=prod" -var="domain_name=jeremyspofford.dev"
```

## CI/CD Pipeline
The GitHub Actions workflow automatically selects the correct workspace:
- **Push to main**: Selects `stage` workspace -> Deploys to `stage.jeremyspofford.dev`.
- **Manual Trigger**: Selects `prod` workspace -> Deploys to `jeremyspofford.dev`.
