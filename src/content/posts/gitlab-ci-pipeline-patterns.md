---
title: "How I Structure GitLab CI/CD Pipelines for Real Projects"
date: "2026-03-18"
description: "Patterns I use to build modular, maintainable GitLab pipelines — with real examples covering multi-environment deployments, change detection, YAML anchors, and automated promotion."
tags: ["GitLab", "CI/CD", "DevOps", "pipelines", "automation"]
---

# How I Structure GitLab CI/CD Pipelines for Real Projects

Most GitLab CI tutorials show you a 20-line `.gitlab-ci.yml` that runs `npm test`. That's fine for a side project. But when you're deploying a monorepo with a frontend, backend, infrastructure-as-code, and container images across three environments — you need something more intentional.

This post walks through the patterns I use in production pipelines. Every example is drawn from a real project (simplified for clarity), not a contrived demo.

## The Problem with One Big File

The default approach — one `.gitlab-ci.yml` with every job — falls apart fast. When you have 30+ jobs across validate, test, build, plan, deploy, and notify stages, a single file becomes unmanageable. Nobody wants to scroll through 800 lines of YAML to find the deploy job they need to tweak.

## Pattern 1: Modular Includes

Split your pipeline into domain-specific files and compose them with `include`:

```yaml
# .gitlab-ci.yml (root)
include:
  - local: '.gitlab/ci/shared/shared.gitlab-ci.yml'
  - local: '.gitlab/ci/api.gitlab-ci.yml'
  - local: '.gitlab/ci/frontend.gitlab-ci.yml'
  - local: '.gitlab/ci/infrastructure.gitlab-ci.yml'
  - local: '.gitlab/ci/ops.gitlab-ci.yml'
```

**Order matters.** GitLab processes includes sequentially. If `api.gitlab-ci.yml` references a YAML anchor defined in `shared.gitlab-ci.yml`, the shared file must come first. Get this wrong and you'll see cryptic "unknown keys" errors.

I organize the file structure like this:

```
.gitlab/
├── ci/
│   ├── shared/
│   │   ├── shared.gitlab-ci.yml    # Variables, rules, anchors
│   │   └── templates.gitlab-ci.yml # Reusable job templates
│   ├── api.gitlab-ci.yml           # Backend test/build/deploy
│   ├── frontend.gitlab-ci.yml      # Frontend test/build/deploy
│   └── infrastructure.gitlab-ci.yml # Terraform plan/apply
└── README.md
```

Each domain file is self-contained: it defines the test, build, and deploy jobs for that service. An engineer working on the frontend only needs to look at `frontend.gitlab-ci.yml`.

## Pattern 2: Environment Branching with YAML Anchors

I use an environment branching strategy: `dev` (default) → `stage` → `prod`. Each branch maps to an AWS account and URL. The trick is making every job automatically resolve the right environment without hardcoding anything.

First, define variables per environment using YAML anchors:

```yaml
# shared.gitlab-ci.yml

.vars-dev: &vars-dev
  AWS_ACCOUNT: $AWS_ACCOUNT_DEV
  ENVIRONMENT: dev
  ENVIRONMENT_URL: https://dev.example.com

.vars-stage: &vars-stage
  AWS_ACCOUNT: $AWS_ACCOUNT_STAGE
  ENVIRONMENT: stage
  ENVIRONMENT_URL: https://stage.example.com

.vars-prod: &vars-prod
  AWS_ACCOUNT: $AWS_ACCOUNT_PROD
  ENVIRONMENT: prod
  ENVIRONMENT_URL: https://example.com
```

Then define branch/MR detection rules:

```yaml
.if-dev-commit: &if-dev-commit
  if: '$CI_COMMIT_REF_NAME == "dev" && $CI_PIPELINE_SOURCE == "push"'

.if-dev-mr: &if-dev-mr
  if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "dev"'

# Same pattern for stage and prod...
```

Now compose them into atomic rule entries that bundle the condition with its variables:

```yaml
.rule-dev-commit: &rule-dev-commit
  <<: *if-dev-commit
  interruptible: false  # Never cancel a deployment in progress
  variables:
    <<: [*vars-dev]

.rule-dev-mr: &rule-dev-mr
  <<: *if-dev-mr
  interruptible: true  # Safe to cancel MR pipelines
  variables:
    <<: [*vars-dev]
```

And finally, full rule sets that jobs can reference:

```yaml
.rules:all:mr:commit:
  rules:
    - <<: *rule-dev-mr
    - <<: *rule-dev-commit
    - <<: *rule-stage-mr
    - <<: *rule-stage-commit
    - <<: *rule-prod-mr
    - <<: *rule-prod-commit
```

This means any job can simply `extends: [ .rules:all:mr:commit ]` and it automatically gets the correct `ENVIRONMENT`, `AWS_ACCOUNT`, and `ENVIRONMENT_URL` — no if/else logic needed in the job itself.

## Pattern 3: Reusable Job Templates

Define base jobs that encapsulate common setup, then extend them:

```yaml
# templates.gitlab-ci.yml

.cache:npm:
  cache:
    - key:
        files: [package-lock.json]
        prefix: npm-cache
      paths: [.npm/]
      policy: pull-push

.node:base:
  extends: [.cache:npm]
  image: node:20
  before_script:
    - npm ci --cache .npm --prefer-offline

.test:base:
  extends: [.node:base, .rules:all:mr:commit]
  stage: test
  needs: []
  script:
    - npm run ${TEST_COMMAND}
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
```

Now domain-specific test jobs become minimal:

```yaml
# api.gitlab-ci.yml

test:api:
  extends: [.test:base]
  variables:
    APP_PATH: $API_DIR
    TEST_COMMAND: "test:api"

# frontend.gitlab-ci.yml

test:frontend:
  extends: [.test:base]
  variables:
    APP_PATH: $FRONTEND_DIR
    TEST_COMMAND: "test:frontend"
```

Each test job is 5 lines. All the npm caching, coverage parsing, and environment rules are inherited. When you need to change how tests run globally, you edit one template.

## Pattern 4: Change Detection for MR Pipelines

In a monorepo, you don't want frontend tests re-running when someone changes a Terraform file. Change detection solves this — but only for MR pipelines. Commit pipelines to deployment branches always run everything (you want full confidence before deploying).

Define paths per domain:

```yaml
.paths-frontend: &paths-frontend
  - .gitlab-ci.yml
  - .gitlab/ci/shared/**/*
  - .gitlab/ci/frontend.gitlab-ci.yml
  - package.json
  - package-lock.json
  - apps/frontend/**/*

.paths-api: &paths-api
  - .gitlab-ci.yml
  - .gitlab/ci/shared/**/*
  - .gitlab/ci/api.gitlab-ci.yml
  - apps/api/**/*
```

Then create rules that layer change detection on top of the base rules:

```yaml
.rules:frontend:mr:commit:
  rules:
    # For dev MRs: only run if frontend files changed
    - <<: *rule-dev-mr
      changes:
        paths: *paths-frontend
    # Skip dev MR if no changes matched
    - <<: *if-dev-mr
      when: never
    # All other pipelines: run normally
    - !reference [.rules:all:mr:commit, rules]
```

The key insight: the first rule says "run on dev MRs if these files changed." The second rule says "otherwise, skip on dev MRs." All other rules (stage/prod MRs, commit pipelines) fall through unchanged. This means change detection is surgical — it only applies to dev MR pipelines where fast feedback matters most.

## Pattern 5: Stages That Tell a Story

Don't just use `test`, `build`, `deploy`. Your stages should describe your deployment flow:

```yaml
stages:
  - .pre          # Debug variables, ECR login, auth tokens
  - validate      # Lint, SAST, terraform fmt/validate
  - test          # Unit & integration tests (parallel)
  - build         # Docker images, frontend bundles, Lambda zips
  - infra-plan    # Terraform plan (preview)
  - infra-apply   # Terraform apply (provision)
  - deploy        # Push images, deploy apps
  - verify        # Health checks, smoke tests
  - notify        # Slack/Teams notifications
  - .post         # Cleanup, promotion MRs
```

Splitting `infra-plan` and `infra-apply` into separate stages is intentional. The plan runs on every pipeline (including MRs) so reviewers can see what infrastructure changes a code change will trigger. The apply only runs on commit pipelines to deployment branches.

## Pattern 6: Automated Waterfall Promotion

After a successful deployment to `dev`, I automatically create an MR to promote to `stage`. After `stage` succeeds, same thing for `prod`. This creates a consistent, auditable promotion path without manual intervention.

```yaml
mr_dev_to_stage:
  stage: .post
  image: registry.gitlab.com/gitlab-org/cli:latest
  rules:
    - if: '$CI_COMMIT_REF_NAME == "dev" && $CI_PIPELINE_SOURCE == "push"'
  allow_failure: true
  script:
    - |
      glab mr create \
        --source-branch dev \
        --target-branch stage \
        --title "Promote Dev to Stage" \
        --description "Automatic promotion from pipeline $CI_PIPELINE_ID." \
        --yes --remove-source-branch=false

auto_merge_dev_to_stage:
  stage: .post
  image: registry.gitlab.com/gitlab-org/cli:latest
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "stage"'
  when: on_success
  script:
    - glab mr merge ${CI_MERGE_REQUEST_IID} --yes --squash=false --remove-source-branch=false
```

The flow: code merges to `dev` → pipeline runs → `.post` stage creates MR (dev→stage) → stage MR pipeline runs all validations → on success, auto-merges → stage pipeline runs → creates MR (stage→prod) → same pattern.

`allow_failure: true` is important here — the MR creation will fail if one already exists, and that's fine.

## Pattern 7: Smart Defaults

Set sensible defaults at the pipeline level so individual jobs stay clean:

```yaml
default:
  image: node:20
  artifacts:
    expire_in: 1 day
  interruptible: true
  retry:
    max: 1
    when:
      - runner_system_failure
      - stuck_or_timeout_failure
```

Key decisions:
- **`interruptible: true`** by default — new commits cancel stale MR pipelines (with `workflow: auto_cancel`). Override to `false` for deploy jobs.
- **`retry` on infrastructure failures** — flaky runners shouldn't block your pipeline. But only retry on system failures, not script failures (that's a real bug).
- **Short artifact expiry** — 1 day for build artifacts, with deploy jobs overriding to 30 days when needed.

## Pattern 8: Failure Notifications

Pipeline failures should be impossible to miss. I send Adaptive Card payloads to Teams (or Slack) with the specific failed job name and a direct link:

```yaml
notify_failure:
  stage: notify
  image: alpine:latest
  when: on_failure
  rules:
    - if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "stage" || $CI_COMMIT_BRANCH == "prod"'
  script:
    - apk add --no-cache curl jq
    - |
      FAILED_JOBS=$(curl -s \
        --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
        "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/pipelines/${CI_PIPELINE_ID}/jobs?scope[]=failed")
      FAILED_JOB_NAME=$(echo "$FAILED_JOBS" | jq -r '.[0].name // "Unknown"')
    - |
      # Build and send notification payload
      curl -H "Content-Type: application/json" \
        -d "{\"text\": \"Pipeline failed in ${CI_PROJECT_NAME} (${CI_COMMIT_REF_NAME}): ${FAILED_JOB_NAME}\"}" \
        "$WEBHOOK_URL"
```

Only trigger notifications on deployment branches — nobody needs a Teams ping for a failing MR pipeline that's still in progress.

## Pattern 9: Ephemeral Sandbox Environments

For complex features, I spin up a complete sandbox environment on MR pipelines. One click deploys infrastructure, backend, and frontend to an isolated environment:

```yaml
deploy:sandbox:
  stage: deploy
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "dev"'
      when: manual
  environment:
    name: sandbox
    url: https://sandbox.dev.example.com
    on_stop: destroy:sandbox

destroy:sandbox:
  stage: deploy
  when: manual
  environment:
    name: sandbox
    action: stop
  script:
    - terragrunt run --all destroy --non-interactive
```

`when: manual` is critical — you don't want every MR automatically provisioning cloud infrastructure. Engineers opt-in when they need it. The `on_stop` linkage ensures GitLab shows a "Stop" button to tear it down.

## Putting It All Together

The complete pipeline runs about 15 jobs across 10 stages. On a dev MR where only frontend files changed, change detection skips backend and infrastructure jobs — the pipeline finishes in 3-4 minutes instead of 15.

Here's what the workflow looks like end to end:

1. Engineer opens MR targeting `dev`
2. Pipeline runs: lint, test, build, infra plan (only for changed domains)
3. MR gets reviewed and merged
4. Commit pipeline runs everything, deploys to dev
5. `.post` stage auto-creates MR to `stage`
6. Stage MR pipeline validates, auto-merges on success
7. Stage deploys, creates MR to `prod`
8. Prod MR is reviewed manually, merged, deployed
9. If anything fails, Teams gets notified with the exact failed job

## Key Takeaways

**Modularize early.** Split by domain (frontend, backend, infra) not by stage. Each domain owns its full lifecycle.

**Anchor everything.** If you're copying YAML between jobs, you're doing it wrong. Use anchors (`&`/`*`) within files and `!reference` across files.

**Make MR pipelines fast, make commit pipelines thorough.** Change detection on MRs, full runs on deployment branches.

**Automate the boring stuff.** Promotion MRs, failure notifications, reviewer assignment — pipeline automation shouldn't stop at deploy.

**Design for the person after you.** Clear stage names, well-organized includes, and a README in `.gitlab/` means the next engineer isn't reverse-engineering your YAML at 2am.
