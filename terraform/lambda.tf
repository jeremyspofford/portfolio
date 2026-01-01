
# Archive for GetContent
data "archive_file" "get_content" {
  type        = "zip"
  source_file = "${path.module}/../backend/handlers/get_content.js"
  output_path = "${path.module}/dist/get_content.zip"
}

# Archive for EnhanceContent
data "archive_file" "enhance_content" {
  type        = "zip"
  source_file = "${path.module}/../backend/handlers/enhance_content.js"
  output_path = "${path.module}/dist/enhance_content.zip"
}

# Archive for SyncContributions
data "archive_file" "sync_contributions" {
  type        = "zip"
  source_file = "${path.module}/../backend/handlers/sync_contributions.js"
  output_path = "${path.module}/dist/sync_contributions.zip"
}

# Archive for PutContent
data "archive_file" "put_content" {
  type        = "zip"
  source_file = "${path.module}/../backend/handlers/put_content.js"
  output_path = "${path.module}/dist/put_content.zip"
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
  filename         = data.archive_file.get_content.output_path
  function_name    = "portfolio-get-content"
  role             = aws_iam_role.lambda_role.arn
  handler          = "get_content.handler"
  source_code_hash = data.archive_file.get_content.output_base64sha256
  runtime          = "nodejs18.x"
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.portfolio_content.name
    }
  }
}

resource "aws_lambda_function" "enhance_content" {
  filename         = data.archive_file.enhance_content.output_path
  function_name    = "portfolio-enhance-content"
  role             = aws_iam_role.lambda_role.arn
  handler          = "enhance_content.handler"
  source_code_hash = data.archive_file.enhance_content.output_base64sha256
  runtime          = "nodejs18.x"
  timeout          = 30
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.portfolio_content.name
    }
  }
}

resource "aws_lambda_function" "sync_contributions" {
  filename         = data.archive_file.sync_contributions.output_path
  function_name    = "portfolio-sync-contributions"
  role             = aws_iam_role.lambda_role.arn
  handler          = "sync_contributions.handler"
  source_code_hash = data.archive_file.sync_contributions.output_base64sha256
  runtime          = "nodejs18.x"
  timeout          = 60
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.portfolio_content.name
    }
  }
}

resource "aws_lambda_function" "put_content" {
  filename         = data.archive_file.put_content.output_path
  function_name    = "portfolio-put-content"
  role             = aws_iam_role.lambda_role.arn
  handler          = "put_content.handler"
  source_code_hash = data.archive_file.put_content.output_base64sha256
  runtime          = "nodejs18.x"
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.portfolio_content.name
    }
  }
}
