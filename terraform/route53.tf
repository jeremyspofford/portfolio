# Route 53 Hosted Zone for jeremyspofford.dev
# Only created if use_custom_domain is true

resource "aws_route53_zone" "main" {
  count = var.use_custom_domain ? 1 : 0
  name  = var.root_domain

  tags = {
    Name        = "Portfolio DNS Zone"
    Environment = var.environment
  }
}

# ACM Certificate DNS Validation Records
resource "aws_route53_record" "acm_validation" {
  for_each = var.use_custom_domain ? {
    for dvo in aws_acm_certificate.wildcard[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main[0].zone_id
}

# A Record for root domain (jeremyspofford.dev) pointing to CloudFront
resource "aws_route53_record" "root_a" {
  count   = var.use_custom_domain && var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.main[0].zone_id
  name    = var.root_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# AAAA Record for root domain (IPv6)
resource "aws_route53_record" "root_aaaa" {
  count   = var.use_custom_domain && var.environment == "prod" ? 1 : 0
  zone_id = aws_route53_zone.main[0].zone_id
  name    = var.root_domain
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# A Record for staging subdomain (staging.jeremyspofford.dev)
resource "aws_route53_record" "staging_a" {
  count   = var.use_custom_domain && var.environment == "staging" ? 1 : 0
  zone_id = aws_route53_zone.main[0].zone_id
  name    = "staging.${var.root_domain}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# AAAA Record for staging subdomain (IPv6)
resource "aws_route53_record" "staging_aaaa" {
  count   = var.use_custom_domain && var.environment == "staging" ? 1 : 0
  zone_id = aws_route53_zone.main[0].zone_id
  name    = "staging.${var.root_domain}"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# Output the nameservers - user needs to update these in Namecheap
output "route53_nameservers" {
  description = "Update these nameservers in Namecheap for jeremyspofford.dev"
  value       = var.use_custom_domain ? aws_route53_zone.main[0].name_servers : []
}

output "route53_zone_id" {
  description = "Route 53 hosted zone ID"
  value       = var.use_custom_domain ? aws_route53_zone.main[0].zone_id : ""
}
