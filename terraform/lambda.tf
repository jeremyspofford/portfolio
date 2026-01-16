# Shared Archive for All Lambdas (includes node_modules)
data "archive_file" "backend_package" {
  type        = "zip"
  source_dir  = "${path.module}/../backend"
  output_path = "${path.module}/dist/backend_package.zip"
  excludes    = ["package-lock.json", ".git", ".gitignore"]
}

# IAM Role for Lambdas (Shared Base)
resource "aws_iam_role" "lambda_role" {
  name = "portfolio-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Policy for DynamoDB Access
resource "aws_iam_policy" "dynamo_policy" {
  name = "portfolio-dynamo-policy-${var.environment}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchGetItem",
        "dynamodb:BatchWriteItem"
      ]
      Resource = aws_dynamodb_table.portfolio_content.arn
    }]
  })
}

resource "aws_iam_role_policy_attachment" "dynamo_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.dynamo_policy.arn
}

# Policy for Bedrock Access (Enhanced Content)
resource "aws_iam_policy" "bedrock_policy" {
  name = "portfolio-bedrock-policy-${var.environment}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = ["bedrock:InvokeModel"]
      Resource = [
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
        "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
      ]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "bedrock_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.bedrock_policy.arn
}

# Policy for SES Access (Contact Form) - only if contact email is configured
resource "aws_iam_policy" "ses_policy" {
  count = var.contact_email_from != "" ? 1 : 0
  name  = "portfolio-ses-policy-${var.environment}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ]
      Resource = "*"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ses_attach" {
  count      = var.contact_email_from != "" ? 1 : 0
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.ses_policy[0].arn
}

# LAMBDA FUNCTIONS

resource "aws_lambda_function" "get_content" {
  filename         = data.archive_file.backend_package.output_path
  function_name    = "portfolio-get-content-${var.environment}"
  role             = aws_iam_role.lambda_role.arn
  handler          = "handlers/get_content.handler"
  source_code_hash = data.archive_file.backend_package.output_base64sha256
  runtime          = "nodejs18.x"
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.portfolio_content.name
    }
  }
}

resource "aws_lambda_function" "enhance_content" {
  filename         = data.archive_file.backend_package.output_path
  function_name    = "portfolio-enhance-content-${var.environment}"
  role             = aws_iam_role.lambda_role.arn
  handler          = "handlers/enhance_content.handler"
  source_code_hash = data.archive_file.backend_package.output_base64sha256
  runtime          = "nodejs18.x"
  timeout          = 30
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.portfolio_content.name
    }
  }
}

resource "aws_lambda_function" "sync_contributions" {
  filename         = data.archive_file.backend_package.output_path
  function_name    = "portfolio-sync-contributions-${var.environment}"
  role             = aws_iam_role.lambda_role.arn
  handler          = "handlers/sync_contributions.handler"
  source_code_hash = data.archive_file.backend_package.output_base64sha256
  runtime          = "nodejs18.x"
  timeout          = 60
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.portfolio_content.name
    }
  }
}

resource "aws_lambda_function" "contact_form" {
  count            = var.contact_email_from != "" ? 1 : 0
  filename         = data.archive_file.backend_package.output_path
  function_name    = "portfolio-contact-form-${var.environment}"
  role             = aws_iam_role.lambda_role.arn
  handler          = "handlers/contact_form.handler"
  source_code_hash = data.archive_file.backend_package.output_base64sha256
  runtime          = "nodejs18.x"
  timeout          = 10
  environment {
    variables = {
      CONTACT_FROM_EMAIL = var.contact_email_from
      CONTACT_TO_EMAIL   = var.contact_email_to
    }
  }
}
