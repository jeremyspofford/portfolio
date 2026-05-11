---
title: "Alarms Aren't Folklore"
date: "2026-05-08"
description: "Treat CloudWatch alarms, log retention, and notification routing as code in the repo - not console clicks somebody made two years ago. The patterns I use across a production AWS environment: master switch, metric math, retention tiers, SNS-to-Teams via channel email."
tags: ["monitoring", "observability", "devops", "aws", "cloudwatch", "terraform"]
---

# Alarms Aren't Folklore

If your alarms don't live in version control, you don't have monitoring. You have folklore. Every "why did this page us at 3am?" question needs an answer that starts with `git log`, not "let me see who's still around from when this was set up."

Most teams I've seen struggle with monitoring didn't pick the wrong vendor. Half their alarms were created by hand in the AWS console two years ago by someone who left, and nobody can tell you why the threshold is 47.

Here's how a production AWS environment I help maintain handles this - CloudWatch alarms in terraform, metric math for the rates that matter, retention tiers per environment, SNS routing that lands in the right inbox without bespoke integrations.

## Pattern 1: Master enable/disable switch

Every alarm in the monitoring module is gated on a single `enable_monitoring` variable using terraform's `count` pattern. Lets sandbox environments run with monitoring off entirely while prod and staging inherit the default:

```hcl
variable "enable_monitoring" {
  description = "Master switch to enable/disable monitoring resources"
  type        = bool
  default     = true
}

resource "aws_cloudwatch_metric_alarm" "lambda_throttles_warning" {
  count = var.enable_monitoring ? 1 : 0

  alarm_name          = "${var.name_prefix}-lambda-throttles-warning"
  namespace           = "AWS/Lambda"
  metric_name         = "Throttles"
  dimensions          = { FunctionName = var.lambda_function_name }
  statistic           = "Sum"
  period              = 300
  comparison_operator = "GreaterThanOrEqualToThreshold"
  threshold           = local.lambda_config.throttle_threshold
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.warning.arn]
}
```

`count = var.enable_monitoring ? 1 : 0` is idiomatic terraform for "create this only if the flag is on." For `for_each` resources (per-table DynamoDB alarms, for example), the equivalent is `for_each = var.enable_monitoring ? local.tables : {}`.

Per-resource `enabled` flags rot. One master switch at the module level is what you reach for when you're spinning up a short-lived test environment or trying to silence an alarm storm.

## Pattern 2: Metric math for derived rates

Raw counters lie. "47 Lambda errors in the last 5 minutes" means very different things during peak traffic (rounding error) vs a quiet window (something is broken). The signal you actually want is the rate - errors as a percentage of invocations.

CloudWatch supports this through metric math. An alarm with multiple `metric_query` blocks can reference underlying metrics by ID and compute a derived value:

```hcl
resource "aws_cloudwatch_metric_alarm" "lambda_error_rate_critical" {
  count = var.enable_monitoring ? 1 : 0

  alarm_name          = "${var.name_prefix}-lambda-error-rate-critical"
  comparison_operator = "GreaterThanThreshold"
  threshold           = local.lambda_config.error_rate_threshold
  evaluation_periods  = 2
  datapoints_to_alarm = 2
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.critical.arn]

  metric_query {
    id          = "e1"
    label       = "ErrorRatePercent"
    expression  = "IF(m2>0,(m1/m2)*100,0)"
    return_data = true
  }

  metric_query {
    id = "m1"
    metric {
      namespace   = "AWS/Lambda"
      metric_name = "Errors"
      dimensions  = { FunctionName = var.lambda_function_name }
      period      = 300
      stat        = "Sum"
    }
  }

  metric_query {
    id = "m2"
    metric {
      namespace   = "AWS/Lambda"
      metric_name = "Invocations"
      dimensions  = { FunctionName = var.lambda_function_name }
      period      = 300
      stat        = "Sum"
    }
  }
}
```

The `IF(m2>0,(m1/m2)*100,0)` expression is the key. Without that guard, a zero-invocations window leaves `m1/m2` as `0/0` - CloudWatch emits no datapoint, and how the alarm reacts then depends entirely on your `treat_missing_data` setting. That's a coupling you don't want. The alarm's behavior during a quiet window is decided by a config line in a different place. The guard returns a clean `0` whenever there's no traffic, so the alarm only fires on actual error bursts regardless of how missing data is handled.

Same shape works for API Gateway 5XX rate (`5XXError / Count`), 4XX rate (`4XXError / Count`), and any other "errors per request" metric.

## Pattern 3: Retention tiers per environment

Log retention is one of those things nobody thinks about until the AWS bill shows CloudWatch Logs costing more than Lambda compute. Fix is trivial once monitoring is code: set retention per environment via a single variable.

```hcl
resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = var.log_retention_days
  tags              = var.tags
}
```

Defaults I use:

| Environment | Retention | Why |
|---|---|---|
| prod | 30 days | Compliance + enough history to debug a last-week incident |
| stage | 14 days | Useful for the current sprint, not a long-term archive |
| dev | 7 days | Debugging the current branch, nothing more |
| sandbox | 3 days | Ephemeral; cost floor |

Each environment's `env.hcl` overrides the default:

```hcl
# stage/env.hcl
locals {
  log_retention_days = 14
}
```

Two lines per environment. No console click, no drift, no surprise bill. Value flows through terragrunt inputs into every module that creates a log group.

If you need long-term retention for compliance, ship logs to S3 via a subscription filter. Don't raise CloudWatch retention to 400 days. S3 is an order of magnitude cheaper and you can lifecycle it to Glacier.

## Pattern 4: SNS routing, and the Teams channel-email trick

Two SNS topics, split by severity:

```hcl
resource "aws_sns_topic" "critical" {
  name              = "${var.name_prefix}-alerts-critical"
  kms_master_key_id = var.kms_key_id
}

resource "aws_sns_topic" "warning" {
  name              = "${var.name_prefix}-alerts-warning"
  kms_master_key_id = var.kms_key_id
}

resource "aws_sns_topic_subscription" "critical_email" {
  for_each = local.enable_email ? toset(local.email_addresses) : toset([])

  topic_arn = aws_sns_topic.critical.arn
  protocol  = "email"
  endpoint  = each.value
}
```

Critical alarms (error rates, 5XX rates, DynamoDB system errors) go to the critical topic. Warnings (throttles, 4XX rates, p99 latency) go to the warning topic. Both topics are KMS-encrypted. Email addresses come in via a list input, so adding a subscriber is a config change, not a console click.

The Teams piece is worth calling out because it's often described incorrectly. There is no Teams webhook involved. Microsoft Teams exposes a per-channel email address - any message sent to that address posts into the channel. So "route critical alerts to the ops channel" becomes: subscribe the channel's email address to the SNS topic, same as any other email subscriber. SNS fans out, Teams ingests the email, the channel gets the message. No bot, no bespoke integration, no token to rotate.

```hcl
email_addresses = compact([
  var.ops_oncall_email,
  "<teams-channel-id>@amer.teams.ms",
])
```

Simplest possible thing that works, and it survives vendor changes to the Teams webhook API because it doesn't use them.

## Pattern 5: One taxonomy across resource types

Different AWS services expose different metrics, but the alarm taxonomy stays consistent: errors, throughput problems, latency. For each resource type I cover all three.

**Lambda:**
- Error rate (metric math, critical) - errors as % of invocations
- Throttles (raw count, warning) - concurrency ceiling hit
- Duration p99 (extended statistic, warning) - performance regression

**API Gateway:**
- 5XX rate (metric math, critical) - server failures
- 4XX rate (metric math, warning) - client issues or misrouted requests
- Latency p99 (extended statistic, warning) - slow endpoints

**DynamoDB** (using `for_each` over tables):
- SystemErrors (critical) - AWS-side failures
- UserErrors (warning) - malformed requests, usually our bug
- ReadThrottleEvents / WriteThrottleEvents (warning) - capacity undersized
- SuccessfulRequestLatency (warning) - slow queries

Each threshold is configurable via a `monitoring_config` variable, so staging can run looser thresholds than production without duplicating resource definitions. Defaults in the module, per-environment overrides slot in through the same `env.hcl` path that sets log retention.

## What you get out of this

- Sandbox spin-up creates no alarms. One flag, no page storms.
- A threshold change is a three-line MR with a reviewer, not a console click.
- A new DynamoDB table gets all five alarm types automatically because it's in the `for_each`.
- Log retention and thresholds are set per environment by the same file that sets the account ID.
- Teams gets notified without a webhook, without a token, without a dedicated integration.

None of this is clever. It's the same "config is code" discipline you already apply to application infrastructure, extended to the observability layer. Your alarms shouldn't be folklore. They should be in the repo, tagged, reviewed, and deployed, same as everything else.
