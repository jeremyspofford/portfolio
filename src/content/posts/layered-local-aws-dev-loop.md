---
title: "A Layered Local AWS Dev Loop: LocalStack and SAM Hybrid"
date: "2026-04-19"
description: "Why we built two local-dev modes for the same backend — fully-offline LocalStack for unit-test loops, and a SAM hybrid that hits real AWS dev resources when integration tests demand it. Plus the gotchas that cost us hours."
tags: ["aws", "localstack", "sam", "local-development", "developer-experience", "devops"]
---

# A Layered Local AWS Dev Loop: LocalStack and SAM Hybrid

Most "local AWS" setups pick a side. Emulate the whole cloud with LocalStack and pretend everything's fine until the first IAM edge case hits staging, or point everything at a shared dev account and live with ten engineers sharing one DynamoDB table.

Neither worked for a backend service I work on. What worked was two modes and a clear rule about when to use which.

## Why two modes

Three drivers forced the split:

- **No real AWS credentials required for the offline path.** LocalStack accepts any string as its access key. A fresh clone runs the test suite without a real AWS profile, `~/.aws/credentials`, or SSO — useful for CI runners and new engineers without provisioned access.
- **Fast feedback for unit tests.** No round-trips to `us-east-1`, no rate limits, no shared-env pollution. A test against LocalStack over loopback returns in milliseconds; real AWS costs 50–200ms per call and a credentials refresh every hour.
- **No AWS bill for the inner loop.** Ten thousand S3 puts against LocalStack is free. Against real S3 it's not a budget event either, but multiply it across a team running tests all day and it stops being zero.

This is not a "fully offline development" pitch. The offline path is for the inner loop, and you graduate out of it on purpose.

## Two modes by design

Two npm scripts. One hand-off.

```
npm run local   # offline: LocalStack + SAM pointed at the container
npm run dev     # hybrid: SAM pointed at deployed AWS dev resources
```

`npm run local` runs `localstack:start` (which is `docker compose up -d`) then `sam local start-api` pointed at the LocalStack container. No real AWS contact. Good for TDD loops, unit tests, rapid iteration — anywhere "AWS, approximately" is good enough.

`npm run dev` skips LocalStack and runs `sam local start-api` bootstrapped against a real AWS profile. Lambda still runs locally in a Docker container, but every AWS SDK call goes to the real dev account — real Cognito pool, real S3 bucket with real IAM, real DynamoDB table with its real GSIs. Good for integration tests and pre-merge checks.

The hand-off: start in `local` for the inner loop, switch to `dev` when you're about to merge and want the change running against real IAM before CI sees it.

## LocalStack container setup

The `docker-compose.yml` is small:

```yaml
services:
  localstack:
    image: localstack/localstack:4.13.1
    ports:
      - "4566:4566"
      - "4510-4559:4510-4559"  # Legacy per-service port range — optional on LocalStack 4.x
    environment:
      - SERVICES=s3,dynamodb,lambda,apigateway,secretsmanager,sns,cloudwatch,iam,logs
      - DEBUG=1
      - DEFAULT_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "./localstack-data:/var/lib/localstack"
      - "./localstack-init.sh:/etc/localstack/init/ready.d/init-resources.sh:ro"
    networks:
      - localstack-network

networks:
  localstack-network:
    name: localstack-network
    driver: bridge
```

Two things in here are load-bearing.

The `localstack-network` bridge is named explicitly, not left to Docker's default. SAM's Lambda containers need to join it by name in the next section — without a named network, you can't tell SAM which one to attach to.

The init script mount — `/etc/localstack/init/ready.d/` — runs a shell script once the container is healthy. That's where seed resources get created: DynamoDB tables, S3 buckets, SNS topics, whatever your tests assume exists. Without it, your first test fails because the table it's querying doesn't exist.

## The `s3_use_path_style = true` gotcha

This cost real hours the first time.

Point your AWS SDK at `http://localhost:4566` and the default behavior burns you. Modern SDKs use virtual-hosted-style addressing — `https://bucketname.s3.amazonaws.com/key`. The cause isn't a tier restriction; it's how LocalStack parses the target bucket. LocalStack only routes virtual-hosted-style requests when the endpoint is prefixed with `s3.` (e.g., `http://s3.localhost.localstack.cloud:4566`). Point an SDK at plain `http://localhost:4566` and the SDK produces `bucketname.localhost:4566` as the request host, which LocalStack can't parse.

When that happens, the first call often hangs for multiple minutes — not a fast error, a silent hang. The timeout fires with a generic message that says nothing about addressing style.

The debugging is miserable: logs show the S3 client starting, nothing for two minutes, then a timeout. You restart LocalStack, same thing. Eventually a forum thread surfaces path-style as the answer.

The fix is one line. In Terraform's AWS provider:

```hcl
provider "aws" {
  s3_use_path_style = true
  endpoints {
    s3 = "http://localhost:4566"
  }
}
```

In the JS SDK v3: `forcePathStyle: true` on the `S3Client` constructor config. Equivalent knobs exist in every SDK. Both fixes work; path-style is the less invasive option when the setup already targets `localhost:4566`.

## The SAM `--docker-network` quirk

The SAM commands for the two modes look almost identical. The difference is one flag.

Local mode (LocalStack under SAM):

```bash
sam local start-api \
  --warm-containers LAZY \
  --template .aws-sam/build/template.yaml \
  --port 3000 \
  --profile sam-local \
  --docker-network localstack-network
```

Dev mode (SAM against real AWS):

```bash
sam local start-api \
  --warm-containers LAZY \
  --template .aws-sam/build/template.yaml \
  --port 3000 \
  --profile dev-profile
```

The `--docker-network localstack-network` flag is the entire difference, and missing it is the second hours-long debug session on this setup. (`--profile sam-local` is a throwaway entry in `~/.aws/config` with dummy credentials — `aws_access_key_id=test` — SAM requires a profile argument, but no real AWS credentials are needed.)

The problem: SAM runs each Lambda invocation in its own Docker container, on SAM's default network. LocalStack lives on the `localstack-network` bridge. Different networks, different loopback interfaces. When the Lambda calls `http://localhost:4566`, the request stays inside the SAM container — nothing on port 4566 there — instead of reaching LocalStack.

The error is usually "connection refused" or a DNS failure. Not "wrong network." The message points at the symptom, so the first instinct is to check whether LocalStack is up (it is) or your code has a typo (it doesn't).

`--docker-network localstack-network` joins SAM's Lambda containers to the same bridge. After that, `http://localstack:4566` (by container name) works. (`http://host.docker.internal:4566` is also an option but only resolves on Docker Desktop; Linux requires additional compose config.) One flag, invisible if you don't know to look for it.

Worth noting: `--warm-containers LAZY` keeps Lambda containers alive between requests. Without it, SAM spins up a cold container per request — painfully slow. `LAZY` is the practical default.

## What LocalStack still doesn't fake well

Honest accounting, because this is why the `dev` mode exists.

- **IAM enforcement.** LocalStack's IAM is off by default — set `ENFORCE_IAM=1` or no policy is evaluated. Authorization tests that pass locally may fail in real AWS because the policy was never evaluated at all.
- **Cognito triggers and token validation.** Community covers the core signup/login/token surface but has gaps around Lambda triggers and some token validation edge cases. Trigger-heavy auth flows need a real dev user pool.
- **Service quotas and throttling.** LocalStack doesn't enforce AWS quotas. Your retry-on-`ProvisionedThroughputExceededException` path never gets exercised because LocalStack's DynamoDB has no provisioned throttling. The first time that code runs is in staging.
- **IAM propagation windows.** Real AWS takes 5–15 seconds for new policies or role-trust changes to propagate before they take effect. LocalStack applies them instantly. Code that doesn't account for this passes locally then hits race conditions in real AWS — a role used before its trust relationship has propagated is the classic case.

The `npm run dev` mode closes these gaps. For the integration layer, that's not a convenience — it's a correctness requirement.

## The value is the graduation

The pitch isn't "we developed everything offline." It's: **the inner loop is offline and fast, and the mode-switch to real AWS is one `npm run` away when you need it.**

Offline-only breaks on the first IAM edge case or Cognito flow. Real-AWS-only gives every engineer SSO, a shared table, and an AWS bill for test runs. Layered gives you both — cheap, credentialless iteration for the 90%, and a clean escalation for the 10% that needs real AWS.

That graduation is what makes the pattern work.
