# Use existing GitHub OIDC provider if it exists, otherwise create one
data "aws_iam_openid_connect_provider" "github_existing" {
  url = "https://token.actions.githubusercontent.com"
}

locals {
  github_oidc_arn = data.aws_iam_openid_connect_provider.github_existing.arn
}

resource "aws_iam_role" "github_actions_role" {
  name = "portfolio_github_actions_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRoleWithWebIdentity"
      Effect = "Allow"
      Principal = {
        Federated = local.github_oidc_arn
      }
      Condition = {
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:jeremyspofford/portfolio:*" # Lock to your repo
        }
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "github_admin_policy" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess" # For deploying infra. Can limit scope later.
}
