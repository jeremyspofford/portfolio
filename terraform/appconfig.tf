# AWS AppConfig for Feature Flags
# Enables runtime feature toggling without redeployment

# AppConfig Application
resource "aws_appconfig_application" "portfolio" {
  name        = "portfolio-app"
  description = "Feature flags for Jeremy Spofford Portfolio"

  tags = {
    Application = "Portfolio"
  }
}

# Environments (staging and production)
resource "aws_appconfig_environment" "staging" {
  name           = "staging"
  description    = "Staging environment for testing features"
  application_id = aws_appconfig_application.portfolio.id

  tags = {
    Environment = "Staging"
  }
}

resource "aws_appconfig_environment" "production" {
  name           = "production"
  description    = "Production environment"
  application_id = aws_appconfig_application.portfolio.id

  tags = {
    Environment = "Production"
  }
}

# Configuration Profile for Feature Flags
resource "aws_appconfig_configuration_profile" "feature_flags" {
  application_id = aws_appconfig_application.portfolio.id
  name           = "feature-flags"
  description    = "Feature flags configuration"
  location_uri   = "hosted"
  type           = "AWS.AppConfig.FeatureFlags"

  tags = {
    Type = "FeatureFlags"
  }
}

# Deployment Strategy - Immediate (for feature flags)
resource "aws_appconfig_deployment_strategy" "immediate" {
  name                           = "portfolio-immediate"
  description                    = "Immediate deployment for feature flags"
  deployment_duration_in_minutes = 0
  final_bake_time_in_minutes     = 0
  growth_factor                  = 100
  growth_type                    = "LINEAR"
  replicate_to                   = "NONE"

  tags = {
    Strategy = "Immediate"
  }
}

# Initial Feature Flags Configuration - Staging (features enabled)
resource "aws_appconfig_hosted_configuration_version" "staging_flags" {
  application_id           = aws_appconfig_application.portfolio.id
  configuration_profile_id = aws_appconfig_configuration_profile.feature_flags.configuration_profile_id
  description              = "Staging feature flags"
  content_type             = "application/json"

  content = jsonencode({
    version = "1"
    flags = {
      showAIShowcase = {
        name = "Show AI Showcase Section"
      }
      showContributions = {
        name = "Show GitHub/GitLab Contributions"
      }
      showResumeDownload = {
        name = "Show Resume Download Button"
      }
      enableJobFitAnalyzer = {
        name = "Enable Job Fit Analyzer"
      }
      enableJobFitUrl = {
        name = "Enable Job Fit URL Input"
      }
    }
    values = {
      showAIShowcase = {
        enabled = true
      }
      showContributions = {
        enabled = true
      }
      showResumeDownload = {
        enabled = true
      }
      enableJobFitAnalyzer = {
        enabled = true
      }
      enableJobFitUrl = {
        enabled = true
      }
    }
  })
}

# Deploy to Staging
resource "aws_appconfig_deployment" "staging" {
  application_id           = aws_appconfig_application.portfolio.id
  configuration_profile_id = aws_appconfig_configuration_profile.feature_flags.configuration_profile_id
  configuration_version    = aws_appconfig_hosted_configuration_version.staging_flags.version_number
  deployment_strategy_id   = aws_appconfig_deployment_strategy.immediate.id
  environment_id           = aws_appconfig_environment.staging.environment_id
  description              = "Deploy staging feature flags"
}

# Production Feature Flags Configuration (more conservative)
resource "aws_appconfig_hosted_configuration_version" "production_flags" {
  application_id           = aws_appconfig_application.portfolio.id
  configuration_profile_id = aws_appconfig_configuration_profile.feature_flags.configuration_profile_id
  description              = "Production feature flags"
  content_type             = "application/json"

  content = jsonencode({
    version = "1"
    flags = {
      showAIShowcase = {
        name = "Show AI Showcase Section"
      }
      showContributions = {
        name = "Show GitHub/GitLab Contributions"
      }
      showResumeDownload = {
        name = "Show Resume Download Button"
      }
      enableJobFitAnalyzer = {
        name = "Enable Job Fit Analyzer"
      }
      enableJobFitUrl = {
        name = "Enable Job Fit URL Input"
      }
    }
    values = {
      showAIShowcase = {
        enabled = false  # Disabled in prod until fully tested
      }
      showContributions = {
        enabled = true
      }
      showResumeDownload = {
        enabled = false
      }
      enableJobFitAnalyzer = {
        enabled = true
      }
      enableJobFitUrl = {
        enabled = true
      }
    }
  })

  depends_on = [aws_appconfig_hosted_configuration_version.staging_flags]
}

# Deploy to Production
resource "aws_appconfig_deployment" "production" {
  application_id           = aws_appconfig_application.portfolio.id
  configuration_profile_id = aws_appconfig_configuration_profile.feature_flags.configuration_profile_id
  configuration_version    = aws_appconfig_hosted_configuration_version.production_flags.version_number
  deployment_strategy_id   = aws_appconfig_deployment_strategy.immediate.id
  environment_id           = aws_appconfig_environment.production.environment_id
  description              = "Deploy production feature flags"

  depends_on = [aws_appconfig_deployment.staging]
}

# IAM Policy for Lambda to access AppConfig
resource "aws_iam_policy" "appconfig_policy" {
  name        = "portfolio_appconfig_policy"
  description = "Allow Lambda to read AppConfig feature flags"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "appconfig:GetLatestConfiguration",
          "appconfig:StartConfigurationSession"
        ]
        Resource = [
          "arn:aws:appconfig:us-east-1:*:application/${aws_appconfig_application.portfolio.id}/environment/*/configuration/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "appconfig_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.appconfig_policy.arn
}

# Outputs
output "appconfig_application_id" {
  value       = aws_appconfig_application.portfolio.id
  description = "AppConfig Application ID"
}

output "appconfig_staging_environment_id" {
  value       = aws_appconfig_environment.staging.environment_id
  description = "AppConfig Staging Environment ID"
}

output "appconfig_production_environment_id" {
  value       = aws_appconfig_environment.production.environment_id
  description = "AppConfig Production Environment ID"
}

output "appconfig_profile_id" {
  value       = aws_appconfig_configuration_profile.feature_flags.configuration_profile_id
  description = "AppConfig Configuration Profile ID"
}
