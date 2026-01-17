resource "aws_dynamodb_table" "portfolio_content" {
  name         = "portfolio-content-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  tags = {
    Name = "portfolio-content-${var.environment}"
  }
}
