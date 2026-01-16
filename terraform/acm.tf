# ACM Certificate for custom domain (wildcard)
# Only created if use_custom_domain is true

resource "aws_acm_certificate" "wildcard" {
  count                     = var.use_custom_domain ? 1 : 0
  domain_name               = var.root_domain
  subject_alternative_names = ["*.${var.root_domain}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "Portfolio Wildcard Certificate (${var.environment})"
  }
}

# Certificate validation using Route 53 DNS records
resource "aws_acm_certificate_validation" "wildcard" {
  count           = var.use_custom_domain ? 1 : 0
  certificate_arn = aws_acm_certificate.wildcard[0].arn

  # Use Route 53 records for automatic validation
  validation_record_fqdns = [for record in aws_route53_record.acm_validation : record.fqdn]

  timeouts {
    create = "45m"
  }
}

# Output the CloudFront distribution domain for DNS setup
output "cloudfront_domain_for_dns" {
  description = "Add a CNAME record pointing your domain to this CloudFront domain"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}
