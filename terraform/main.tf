terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                   = "us-east-1"
  shared_credentials_files = ["/Users/jeremyspofford/.aws/credentials"]
  profile                  = "personal"
  default_tags {
    tags = {
      Project     = "Portfolio"
      ManagedBy   = "Terraform"
      Environment = "Production"
    }
  }
}
