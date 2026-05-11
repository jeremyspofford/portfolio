---
title: "How I Structure GitLab CI/CD Pipelines"
date: "2026-04-06"
description: "Patterns I use to build modular, maintainable GitLab pipelines — with real examples covering multi-environment deployments, change detection, security scanning, container builds, and automated promotion."
tags: ["GitLab", "CI/CD", "DevOps", "pipelines", "automation", "security"]
---

# How I Structure GitLab CI/CD Pipelines

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
  - local: '.gitlab/ci/frontend.gitlab-ci.yml'
  - local: '.gitlab/ci/api.gitlab-ci.yml'
  - local: '.gitlab/ci/container-service.gitlab-ci.yml'
  - local: '.gitlab/ci/infrastructure.gitlab-ci.yml'
  - local: '.gitlab/ci/security.gitlab-ci.yml'
  - local: '.gitlab/ci/sandbox.gitlab-ci.yml'
  - local: '.gitlab/ci/ops.gitlab-ci.yml'
```

**Order matters.** GitLab processes includes sequentially. If `api.gitlab-ci.yml` references a YAML anchor defined in `shared.gitlab-ci.yml`, the shared file must come first. Get this wrong and you'll see cryptic "unknown keys" errors.

I organize the file structure like this:

```
.gitlab/
├── ci/
│   ├── shared/
│   │   ├── shared.gitlab-ci.yml    # Variables, rules, anchors
│   │   ├── templates.gitlab-ci.yml # Reusable job templates
│   │   └── debug.gitlab-ci.yml    # Pipeline debug/diagnostics
│   ├── frontend.gitlab-ci.yml      # Frontend test/build/deploy
│   ├── api.gitlab-ci.yml           # Backend test/build/deploy
│   ├── container-service.gitlab-ci.yml # Container image build/push/deploy
│   ├── infrastructure.gitlab-ci.yml # Terraform plan/apply
│   ├── security.gitlab-ci.yml      # SAST, dependency audit, IaC scan, DAST
│   ├── sandbox.gitlab-ci.yml       # Ephemeral environments
│   └── ops.gitlab-ci.yml           # Promotion, notifications, reviewer assignment
└── README.md
```

Each domain file is self-contained: it defines the test, build, and deploy jobs for that service. An engineer working on the frontend only needs to look at `frontend.gitlab-ci.yml`. Security scans live in their own file so you can toggle advisory vs. blocking mode without touching any domain pipeline.

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
  - validate      # Lint, terraform fmt/validate
  - security      # SAST, dependency audit, IaC scan, container scan
  - test          # Unit & integration tests (parallel)
  - build         # Docker images, frontend bundles, Lambda zips
  - infra-plan    # Terraform plan (preview)
  - infra-apply   # Terraform apply (provision)
  - deploy        # Push images, deploy apps
  - verify        # Health checks, DAST scans
  - notify        # Teams/Slack notifications
  - .post         # Cleanup, promotion MRs
```

Splitting `infra-plan` and `infra-apply` into separate stages is intentional. The plan runs on every pipeline (including MRs) so reviewers can see what infrastructure changes a code change will trigger. The apply only runs on commit pipelines to deployment branches.

The `security` stage runs in parallel with tests — static analysis doesn't depend on a build, so there's no reason to wait. Dynamic analysis (DAST) runs later in `verify` because it needs a live deployed target to scan against.

## Pattern 6: Security Scanning Pipeline

Security scanning shouldn't be an afterthought bolted onto CI. I run five layers of scanning, each covering a different attack surface:

| Scan | Tool | What it catches | When it runs |
|------|------|----------------|-------------|
| SAST | Semgrep | Code-level vulnerabilities (OWASP Top 10, secrets) | Dev MRs + dev commits |
| Dependencies | npm audit | Known CVEs in packages | Dev MRs + dev commits |
| IaC | Trivy config | Terraform misconfigurations | When infra files change |
| Containers | Trivy image | OS/library CVEs in Docker images | When container files change |
| DAST | OWASP ZAP | Runtime vulnerabilities in live API | Post-deploy to stage |

The first four run in the `security` stage (pre-deploy). DAST runs in `verify` (post-deploy) because it needs a live target.

### Advisory mode: visible but non-blocking

Every security job uses `allow_failure: true`. The pipeline stays green, but a failed security job shows a red X — visible in the MR and pipeline views. This gives you signal without blocking deployments while you triage the initial baseline.

```yaml
sast:semgrep:
  stage: security
  image:
    name: semgrep/semgrep:latest
    entrypoint: [""]
  needs: []
  rules:
    - !reference [.rules:dev:mr:commit, rules]
  script:
    - mkdir -p security-results/semgrep
    - >
      semgrep scan
      --config p/owasp-top-ten
      --config p/javascript
      --config p/typescript
      --config p/secrets
      --gitlab-sast
      --gitlab-sast-output security-results/semgrep/gl-sast-report.json
      apps/
  artifacts:
    when: always
    paths:
      - security-results/semgrep/gl-sast-report.json
    reports:
      sast: security-results/semgrep/gl-sast-report.json
  allow_failure: true
```

Once you've triaged the baseline, flip `allow_failure: false` per scan type to make it blocking. You can do this incrementally — start with SAST (fewest false positives), then dependencies, then IaC.

### Dual output: machines and humans

Each scan produces two artifacts: a machine-readable JSON report for GitLab's Security Dashboard (`artifacts.reports.sast`, `artifacts.reports.container_scanning`, `artifacts.reports.dast`) and a human-readable text file you can browse directly from the pipeline artifact viewer. The dashboard aggregates findings across MRs; the text output lets you triage without leaving the pipeline.

### Container scanning with matrix jobs

When you have multiple container images, use `parallel: matrix` to scan each one as a separate job:

```yaml
scan:container:
  stage: security
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  needs:
    - job: build:container-service
      artifacts: true
  parallel:
    matrix:
      - CONTAINER_NAME: converter-service
        CONTAINER_TAR: "${CI_PROJECT_DIR}/converter-image.tar"
      # Add more images here as your project grows
  script:
    - mkdir -p "security-results/trivy-container/${CONTAINER_NAME}"
    - >
      trivy image
      --input "${CONTAINER_TAR}"
      --severity "HIGH,CRITICAL"
      --format template
      --template "@/contrib/gitlab.tpl"
      --output "security-results/trivy-container/${CONTAINER_NAME}/gl-container-scanning-report.json"
      --exit-code 1
  artifacts:
    when: always
    reports:
      container_scanning: "security-results/trivy-container/${CONTAINER_NAME}/gl-container-scanning-report.json"
  allow_failure: true
```

Adding a new image is one matrix entry. The Trivy `--input` flag scans a tarball from the build stage rather than pulling from a registry — the image doesn't need to be pushed yet.

### Scope limiting: scan once, promote with confidence

Security scans only run on dev MRs and dev commits. Stage and prod are promotion pipelines — the code is identical to what already passed scanning on dev. Re-running SAST on a promotion MR is wasted compute.

The exception is IaC scanning, which runs on all environments because Terraform configs can differ per environment (different instance sizes, different feature flags in tfvars).

### DAST: testing the live API

OWASP ZAP runs post-deploy against the stage environment. It spiders the API for 5 minutes, then runs passive and active rules:

```yaml
dast:zap-baseline:
  stage: verify
  image:
    name: ghcr.io/zaproxy/zaproxy:stable
    entrypoint: [""]
  needs:
    - job: deploy:api
      artifacts: false
  rules:
    - !reference [.rules:stage:commit, rules]
  script:
    - mkdir -p security-results/zap
    - >
      zap-baseline.py
      -c .zap.yml
      -m 5
      -t "https://stage.example.com/api/"
      -J security-results/zap/gl-dast-report.json
      -r security-results/zap/zap-report.html
      -l WARN
  artifacts:
    when: always
    reports:
      dast: security-results/zap/gl-dast-report.json
  allow_failure: true
```

Stage-only is intentional — you need a deployed target, and you don't want ZAP hammering production.

## Pattern 7: Container Image Builds with Kaniko

If your pipeline builds Docker images, you've probably fought with Docker-in-Docker (DinD). It requires privileged mode on the runner, it's slow (starts a Docker daemon every job), and it's a security surface you don't need.

Kaniko builds container images without a Docker daemon. It runs as a regular container — no privileges, no DinD service, no socket mounting.

### Build and push as separate jobs

I split the container pipeline into three stages: build (with `--no-push`), scan, then push. This keeps scanning in the critical path without requiring registry access:

```yaml
build:container-service:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  script:
    - /kaniko/executor
      --context "${APP_PATH}"
      --dockerfile "${APP_PATH}/Dockerfile"
      --destination "${ECR_URI}:latest"
      --destination "${ECR_URI}:${CI_COMMIT_SHORT_SHA}"
      --tar-path "${CI_PROJECT_DIR}/service-image.tar"
      --no-push
  artifacts:
    paths:
      - service-image.tar
    expire_in: 1 day
```

The `--no-push` flag builds the image and saves it as a tarball artifact. Trivy scans the tarball in the `security` stage (Pattern 6). Only on commit pipelines — after tests, scans, and builds all pass — does the image get pushed:

```yaml
push:container-service:
  stage: deploy
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  rules:
    - !reference [.rules:all:commit, rules]
  needs:
    - ecr-login
    - build:container-service
  script:
    - /kaniko/executor
      --context "${APP_PATH}"
      --dockerfile "${APP_PATH}/Dockerfile"
      --destination "${ECR_URI}:latest"
      --destination "${ECR_URI}:${CI_COMMIT_SHORT_SHA}"
```

### ECR authentication in `.pre`

Registry login runs once as a `.pre` job and passes the token as a short-lived artifact:

```yaml
ecr-login:
  stage: .pre
  extends: [.aws_credentials]
  script:
    - aws ecr get-login-password --region ${AWS_DEFAULT_REGION} > ecr-token.txt
  artifacts:
    paths: [ecr-token.txt]
    expire_in: 60 minutes
```

Downstream Kaniko jobs read this token and write their own `/kaniko/.docker/config.json`. The 60-minute expiry means the token is never sitting around longer than one pipeline run.

### Dual tagging

Every push tags with both `latest` and `$CI_COMMIT_SHORT_SHA`. `latest` is convenient for dev workflows. The SHA tag gives you immutable, auditable references — you can always trace exactly which commit is running in each environment.

## Pattern 8: Automated Waterfall Promotion

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

## Pattern 9: Smart Defaults

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

## Pattern 10: Failure Notifications and Status Dashboards

Pipeline failures should be impossible to miss. I send Adaptive Card payloads to Teams with the specific failed job name and a direct link:

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
      # Build and send Adaptive Card payload
      curl -H "Content-Type: application/json" \
        -d "{\"text\": \"Pipeline failed in ${CI_PROJECT_NAME} (${CI_COMMIT_REF_NAME}): ${FAILED_JOB_NAME}\"}" \
        "$WEBHOOK_URL"
```

Only trigger notifications on deployment branches — nobody needs a Teams ping for a failing MR pipeline that's still in progress.

### Environment status dashboard

Beyond failure alerts, I also send a status dashboard card that shows the health of all three environments at a glance. The job queries the GitLab API for the latest pipeline status on each deployment branch and renders a compact Adaptive Card:

```yaml
notify_status:
  stage: notify
  image: alpine:latest
  rules:
    - if: '$CI_COMMIT_BRANCH == "dev" || $CI_COMMIT_BRANCH == "stage" || $CI_COMMIT_BRANCH == "prod"'
  script:
    - apk add --no-cache curl jq
    - |
      get_pipeline_info() {
        PIPELINE_JSON=$(curl -s --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
          "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/pipelines?ref=$1&per_page=1")
        STATUS=$(echo "$PIPELINE_JSON" | jq -r '.[0].status // "unknown"')
        URL=$(echo "$PIPELINE_JSON" | jq -r '.[0].web_url // ""')
        echo "$STATUS|$URL"
      }
      DEV_INFO=$(get_pipeline_info "dev")
      STAGE_INFO=$(get_pipeline_info "stage")
      PROD_INFO=$(get_pipeline_info "prod")
    - |
      # Build Adaptive Card with dev/stage/prod status rows
      # Each row shows: environment name, status icon, links to site + pipeline
```

This runs on both success and failure (controlled by rules). The team gets a single card showing whether dev, stage, and prod are all green — useful after promotions cascade through the pipeline.

## Pattern 11: Ephemeral Sandbox Environments

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

## Pattern 12: Pipeline Debug Job

When a pipeline behaves unexpectedly — wrong environment, missing variables, rules not matching — you need visibility into what GitLab actually resolved at runtime. I keep a lightweight debug job in `.pre` that dumps the pipeline's state:

```yaml
debug:
  extends: [.rules:all:mr:commit]
  stage: .pre
  variables:
    DEBUG_VARIABLES: >
      ENVIRONMENT
      AWS_ACCOUNT
      AWS_DEFAULT_REGION
      APP_DIR
      INFRA_DIR
      DRY_RUN
  script: |
    echo "=== Custom Variables ==="
    for var in ${DEBUG_VARIABLES}; do
      echo "$var = ${!var}"
    done
    echo "=== CI Variables ==="
    env | grep -E 'CI_' | sort
  cache: []
  interruptible: true
```

This runs on every pipeline. It costs under 5 seconds and uses no cache. When something goes wrong, the debug log is already there — no need to add a debug job after the fact and re-run.

The `DEBUG_VARIABLES` list is a curated set of the variables your pipeline actually uses. When you add a new variable to shared config, add it here too. The CI_* dump catches everything GitLab sets automatically — commit info, MR metadata, runner tags, feature flags — which is invaluable when rules aren't behaving as expected.

## Putting It All Together

The complete pipeline runs about 20 jobs across 11 stages. On a dev MR where only frontend files changed, change detection skips backend, container, infrastructure, and most security jobs — the pipeline finishes in 3-4 minutes instead of 20.

Here's what the workflow looks like end to end:

1. Engineer opens MR targeting `dev`
2. Debug job dumps variable state in `.pre`
3. Security scans run in parallel: SAST, dependency audit, IaC scan
4. Tests run for changed domains only (change detection)
5. Build produces frontend bundle, Lambda zip, container tarball
6. Container image gets scanned via Trivy
7. Infrastructure plan shows what Terraform changes the code triggers
8. MR gets reviewed and merged
9. Commit pipeline runs everything, deploys to dev
10. `.post` stage auto-creates MR to `stage`
11. Stage MR pipeline validates, auto-merges on success
12. DAST scan runs against live stage API
13. Stage deploys, creates MR to `prod`
14. Prod MR is reviewed manually, merged, deployed
15. If anything fails, Teams gets notified with the exact failed job
16. Status dashboard shows all three environments at a glance

## Key Takeaways

**Modularize early.** Split by domain (frontend, backend, infra, security) not by stage. Each domain owns its full lifecycle.

**Anchor everything.** If you're copying YAML between jobs, you're doing it wrong. Use anchors (`&`/`*`) within files and `!reference` across files.

**Make MR pipelines fast, make commit pipelines thorough.** Change detection on MRs, full runs on deployment branches.

**Layer your security.** Five scans across two stages: static analysis before deploy, dynamic analysis after. Advisory mode first, blocking after triage. Scan once on dev, promote with confidence.

**Build, scan, then push.** Kaniko's `--no-push` flag lets you scan container images before they touch a registry. The build-scan-push pipeline catches vulnerabilities before they're deployed.

**Automate the boring stuff.** Promotion MRs, failure notifications, reviewer assignment, environment dashboards — pipeline automation shouldn't stop at deploy.

**Make pipelines debuggable.** A 5-second debug job in `.pre` saves hours of troubleshooting when variables don't propagate or rules don't match.

**Design for the person after you.** Clear stage names, well-organized includes, and a README in `.gitlab/` means the next engineer isn't reverse-engineering your YAML at 2am.
