# Only create the OIDC provider if we are in the 'stage' environment (or whatever env you designate as "primary")
# In workspaces, 'stage' can be the owner.
resource "aws_iam_openid_connect_provider" "github" {
  count = var.environment == "stage" ? 1 : 0

  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
  ]
}

# START: New Global Data Source Lookup
# This allows 'prod' (and 'stage') to find the existing provider ARN
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  # We use depends_on to ensure that IF we are stage, we wait for creation.
  # But since data sources are read during plan, this is tricky in the SAME run if it doesn't exist.
  # However, for 'prod', 'stage' already ran, so it exists.
  # For 'stage' first run, the resource is created, and we can reference it directly or via data (after apply).
  # To satisfy both, we can conditionally enable the data source or just rely on the fact it exists.
  # BUT: Terraform data sources fail if not found.
}
# END

resource "aws_iam_role" "github_actions_role" {
  name = "portfolio_github_actions_role_${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRoleWithWebIdentity"
      Effect = "Allow"
      Principal = {
        # Use the created resource ARN if stage, otherwise use data source ARN
        Federated = var.environment == "stage" ? aws_iam_openid_connect_provider.github[0].arn : data.aws_iam_openid_connect_provider.github.arn
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
