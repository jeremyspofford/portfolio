variable "environment" {
  description = "Deployment environment (stage, prod)"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the website (e.g., stage.jeremyspofford.dev)"
  type        = string
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "hosted_zone_name" {
  description = "Route53 Hosted Zone Name"
  type        = string
  default     = "jeremyspofford.dev"
}
