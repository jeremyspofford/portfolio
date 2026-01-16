variable "environment" {
  description = "Deployment environment (prod or staging)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["prod", "staging"], var.environment)
    error_message = "Environment must be 'prod' or 'staging'."
  }
}

variable "domain_name" {
  description = "Primary domain for the environment"
  type        = string
}

variable "root_domain" {
  description = "Root domain for ACM certificate (e.g., jeremyspofford.dev)"
  type        = string
}

variable "contact_email_from" {
  description = "Verified SES email address to send contact form emails FROM"
  type        = string
  default     = ""
}

variable "contact_email_to" {
  description = "Email address to receive contact form submissions"
  type        = string
  default     = ""
}

variable "use_custom_domain" {
  description = "Whether to use a custom domain with ACM certificate"
  type        = bool
  default     = false
}
