# Shared Archive for All Lambdas (includes node_modules)
data "archive_file" "backend_package" {
  type        = "zip"
  source_dir  = "${path.module}/../backend"
  output_path = "${path.module}/dist/backend_package.zip"
  excludes    = ["package-lock.json", ".git", ".gitignore"] # Optional excludes
}

# IAM Role for Lambdas (Shared Base)
resource "aws_iam_role" "lambda_role" {
  name = "portfolio_lambda_role"

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
  name = "portfolio_dynamo_policy"
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
  name = "portfolio_bedrock_policy"
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

# LAMBDA FUNCTIONS

resource "aws_lambda_function" "get_content" {
  filename         = data.archive_file.backend_package.output_path
  function_name    = "portfolio-get-content"
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
  function_name    = "portfolio-enhance-content"
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
  function_name    = "portfolio-sync-contributions"
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

resource "aws_lambda_function" "get_feature_flags" {
  filename         = data.archive_file.backend_package.output_path
  function_name    = "portfolio-get-feature-flags"
  role             = aws_iam_role.lambda_role.arn
  handler          = "handlers/get_feature_flags.handler"
  source_code_hash = data.archive_file.backend_package.output_base64sha256
  runtime          = "nodejs18.x"
  timeout          = 10
  environment {
    variables = {
      APPCONFIG_APP_ID     = aws_appconfig_application.portfolio.id
      APPCONFIG_PROFILE_ID = aws_appconfig_configuration_profile.feature_flags.configuration_profile_id
    }
  }
}


