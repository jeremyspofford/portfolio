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

- **Zero credentials on disk for the offline path.** LocalStack accepts any string as its access key. A fresh clone runs the test suite without an AWS profile, `~/.aws/credentials`, or SSO — useful for CI runners and new engineers without provisioned access.
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
      - "4510-4559:4510-4559"
    environment:
      - SERVICES=s3,dynamodb,lambda,apigateway,secretsmanager,sns,cloudwatch,iam,logs
      - DEBUG=1
      - DEFAULT_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
      - INIT_SCRIPTS_PATH=/etc/localstack/init/ready.d
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

Point your AWS SDK at `http://localhost:4566` and the default behavior burns you. Modern SDKs default to virtual-hosted-style addressing — `https://bucketname.s3.amazonaws.com/key`. LocalStack Community doesn't support virtual-hosted-style. It expects path-style: `http://localhost:4566/bucketname/key`.

When the SDK sends a virtual-hosted-style request, the first call (usually a HEAD on `/`) hangs. Not "fails fast with a clear error" — hangs. For multiple minutes. Eventually the timeout fires with an error that does not say "virtual-hosted-style not supported."

The debugging is miserable: logs show the S3 client starting, nothing for two minutes, then a generic timeout. You assume LocalStack is broken, restart it, same thing, check your code, find nothing. Eventually a forum thread from 2021 surfaces path-style as the answer.

The fix is one line. In Terraform's AWS provider:

```hcl
provider "aws" {
  s3_use_path_style = true
  endpoints {
    s3 = "http://localhost:4566"
  }
}
```

In the JS SDK v3: `forcePathStyle: true` on the S3 client. Equivalent knobs exist in every SDK.

This trips people because the LocalStack docs don't surface it for Community users — virtual-hosted-style is a Pro feature, and the asymmetry is easy to miss. Writing it down so the next search for "LocalStack S3 hang" finds an answer.

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

The `--docker-network localstack-network` flag is the entire difference, and missing it is the second hours-long debug session on this setup.

The problem: SAM runs each Lambda invocation in its own Docker container, on SAM's default network. LocalStack lives on the `localstack-network` bridge. Different networks, different loopback interfaces. When the Lambda calls `http://localhost:4566`, the request stays inside the SAM container — nothing on port 4566 there — instead of reaching LocalStack.

The error is usually "connection refused" or a DNS failure. Not "wrong network." The message points at the symptom, so the first instinct is to check whether LocalStack is up (it is) or your code has a typo (it doesn't).

`--docker-network localstack-network` joins SAM's Lambda containers to the same bridge. After that, `http://localstack:4566` (by container name) or `http://host.docker.internal:4566` works. One flag, invisible if you don't know to look for it.

Worth noting: `--warm-containers LAZY` keeps Lambda containers alive between requests. Without it, SAM spins up a cold container per request — painfully slow. `LAZY` is the practical default.

## What LocalStack still doesn't fake well

Honest accounting, because this is why the `dev` mode exists.

- **IAM policy edge cases.** LocalStack's IAM is permissive-by-default in many paths. A policy that would deny in real AWS may allow in LocalStack, so authorization logic that's secretly broken can pass every local test.
- **Cognito user pools.** Full Cognito is a Pro feature; Community's coverage is thin. Signup, login, token refresh, triggers — realistic integration tests need a real dev pool.
- **Service quotas and throttling.** LocalStack doesn't enforce AWS quotas. Your retry-on-`ProvisionedThroughputExceededException` path never gets exercised because LocalStack's DynamoDB has no provisioned throttling. The first time that code runs is in staging.
- **Eventual consistency windows.** LocalStack typically returns immediately-consistent results where real AWS has a propagation window. Tests that depend on eventual-consistency behavior either pass locally and fail in AWS, or vice versa.

The `npm run dev` mode closes these gaps by pointing at the real thing. For the integration layer, that's not a convenience — it's a correctness requirement.

## The value is the graduation

The pitch isn't "we developed everything offline." It's: **the inner loop is offline and fast, and the mode-switch to real AWS is one `npm run` away when you need it.**

Offline-only breaks on the first IAM edge case or Cognito flow. Real-AWS-only gives every engineer SSO, a shared table, and an AWS bill for test runs. Layered gives you both — cheap, credentialless iteration for the 90%, and a clean escalation for the 10% that needs real AWS.

That graduation is what makes the pattern work.
