resource "aws_apigatewayv2_api" "http_api" {
  name          = "portfolio-api-${var.environment}"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"] # Lock down to CloudFront domain later
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["content-type"]
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

# GET /content -> get_content lambda

resource "aws_apigatewayv2_integration" "get_content" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.get_content.invoke_arn
}

resource "aws_apigatewayv2_route" "get_content" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /content"
  target    = "integrations/${aws_apigatewayv2_integration.get_content.id}"
}

resource "aws_lambda_permission" "api_get_content" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_content.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# POST /enhance -> enhance_content lambda

resource "aws_apigatewayv2_integration" "enhance_content" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.enhance_content.invoke_arn
}

resource "aws_apigatewayv2_route" "enhance_content" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /enhance"
  target    = "integrations/${aws_apigatewayv2_integration.enhance_content.id}"
}

resource "aws_lambda_permission" "api_enhance_content" {
  statement_id  = "AllowExecutionFromAPIGatewayEnhance"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.enhance_content.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# GET /feature-flags -> get_feature_flags lambda

resource "aws_apigatewayv2_integration" "get_feature_flags" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.get_feature_flags.invoke_arn
}

resource "aws_apigatewayv2_route" "get_feature_flags" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /feature-flags"
  target    = "integrations/${aws_apigatewayv2_integration.get_feature_flags.id}"
}

resource "aws_lambda_permission" "api_get_feature_flags" {
  statement_id  = "AllowExecutionFromAPIGatewayFeatureFlags"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_feature_flags.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}
