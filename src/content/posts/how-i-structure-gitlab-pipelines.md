---
title: "How I Structure GitLab CI/CD Pipelines"
date: "2026-04-06"
description: "12 patterns I use to keep GitLab pipelines maintainable across a monorepo with frontend, backend, IaC, and container builds going to three environments. Modular includes, anchor-based environment routing, change detection, layered security scanning, automated promotion."
tags: ["gitlab-ci", "ci-cd", "devops", "pipelines", "automation", "security"]
---

# How I Structure GitLab CI/CD Pipelines

A 20-line `.gitlab-ci.yml` that runs `npm test` is fine for a side project. Falls apart the moment you have a monorepo with frontend, backend, IaC, and container builds going to three environments.

These are the patterns I use in production. Every example is from a real pipeline, simplified for clarity. Twelve patterns sounds like a lot but they layer - includes, environment routing, templates, change detection, then everything that hangs off those.

## Pattern 1: Modular includes

Default approach is one `.gitlab-ci.yml` with every job. That falls apart fast - 30+ jobs across validate, test, build, plan, deploy, notify means 800 lines of yaml nobody wants to scroll through.

Split by domain and compose with `include`:

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

Order matters. GitLab processes includes sequentially. If `api.gitlab-ci.yml` references a yaml anchor defined in `shared.gitlab-ci.yml`, the shared file has to come first. Get it wrong and you get cryptic "unknown keys" errors.

File structure:

```
.gitlab/
├── ci/
│   ├── shared/
│   │   ├── shared.gitlab-ci.yml    # Variables, rules, anchors
│   │   ├── templates.gitlab-ci.yml # Reusable job templates
│   │   └── debug.gitlab-ci.yml     # Pipeline diagnostics
│   ├── frontend.gitlab-ci.yml      # Frontend test/build/deploy
│   ├── api.gitlab-ci.yml           # Backend test/build/deploy
│   ├── container-service.gitlab-ci.yml
│   ├── infrastructure.gitlab-ci.yml # Terraform plan/apply
│   ├── security.gitlab-ci.yml      # SAST, deps, IaC, DAST
│   ├── sandbox.gitlab-ci.yml       # Ephemeral environments
│   └── ops.gitlab-ci.yml           # Promotion, notifications
└── README.md
```

Each domain file is self-contained - test, build, deploy for that one service. Engineer working on the frontend only looks at `frontend.gitlab-ci.yml`. Security scans live in their own file so you can flip advisory vs blocking mode without touching any domain pipeline.

## Pattern 2: Environment branching with yaml anchors

Branching strategy is `dev` (default) → `stage` → `prod`. Each branch maps to an AWS account and URL. Trick is making every job auto-resolve the right env without hardcoding anything.

Variables per environment using yaml anchors:

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

Branch/MR detection rules:

```yaml
.if-dev-commit: &if-dev-commit
  if: '$CI_COMMIT_REF_NAME == "dev" && $CI_PIPELINE_SOURCE == "push"'

.if-dev-mr: &if-dev-mr
  if: '$CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "dev"'

# Same shape for stage and prod
```

Compose into atomic rule entries that bundle the condition with its variables:

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

Full rule sets jobs reference:

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

Any job can `extends: [ .rules:all:mr:commit ]` and automatically gets the right `ENVIRONMENT`, `AWS_ACCOUNT`, and `ENVIRONMENT_URL`. No if/else logic in the job itself.

## Pattern 3: Reusable job templates

Define base jobs for common setup, then extend them:

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

Domain-specific test jobs become minimal:

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

Each test job is 5 lines. All the npm caching, coverage parsing, and environment rules are inherited. Need to change how tests run globally? Edit one template.

## Pattern 4: Change detection on MR pipelines

In a monorepo, you don't want frontend tests re-running when somebody changes a terraform file. Change detection solves that - but only for MR pipelines. Commit pipelines on deployment branches always run everything (you want full confidence before deploying).

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

Layer change detection on top of the base rules:

```yaml
.rules:frontend:mr:commit:
  rules:
    # Dev MRs: only run if frontend files changed
    - <<: *rule-dev-mr
      changes:
        paths: *paths-frontend
    # Skip dev MR if no changes matched
    - <<: *if-dev-mr
      when: never
    # All other pipelines: run normally
    - !reference [.rules:all:mr:commit, rules]
```

The first rule says "run on dev MRs if these files changed." The second says "otherwise skip on dev MRs." Stage/prod MRs and commit pipelines fall through unchanged. Change detection is surgical - only applies to dev MR pipelines where fast feedback matters most.

## Pattern 5: Stages that tell a story

Don't just use `test`, `build`, `deploy`. Stages should describe your deployment flow:

```yaml
stages:
  - .pre          # Debug variables, ECR login, auth tokens
  - validate      # Lint, terraform fmt/validate
  - security      # SAST, deps audit, IaC scan, container scan
  - test          # Unit & integration tests (parallel)
  - build         # Docker images, frontend bundles, Lambda zips
  - infra-plan    # Terraform plan (preview)
  - infra-apply   # Terraform apply (provision)
  - deploy        # Push images, deploy apps
  - verify        # Health checks, DAST scans
  - notify        # Teams/Slack notifications
  - .post         # Cleanup, promotion MRs
```

Splitting `infra-plan` and `infra-apply` is intentional. Plan runs on every pipeline (including MRs) so reviewers see what infra changes a code change will trigger. Apply only runs on commit pipelines to deployment branches.

Security stage runs in parallel with tests - static analysis doesn't depend on a build, no reason to wait. DAST runs later in `verify` because it needs a live deployed target.

## Pattern 6: Layered security scanning

Security shouldn't be an afterthought bolted onto CI. Five layers, each covering a different attack surface:

| Scan | Tool | Catches | Runs |
|------|------|---------|------|
| SAST | Semgrep | Code-level vulns (OWASP Top 10, secrets) | Dev MRs + dev commits |
| Dependencies | npm audit | Known CVEs in packages | Dev MRs + dev commits |
| IaC | Trivy config | Terraform misconfigs | When infra files change |
| Containers | Trivy image | OS/library CVEs in Docker images | When container files change |
| DAST | OWASP ZAP | Runtime vulns in live API | Post-deploy to stage |

First four run in `security` stage (pre-deploy). DAST runs in `verify` (post-deploy) because it needs a live target.

### Advisory mode first

Every security job uses `allow_failure: true` initially. Pipeline stays green, but a failed security job shows a red X - visible in the MR and pipeline views. Signal without blocking deployments while you triage the initial baseline.

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

Once you've triaged the baseline, flip `allow_failure: false` per scan type to make it blocking. Do it incrementally - SAST first (fewest false positives), then deps, then IaC.

### Container scanning with matrix jobs

Multiple container images? Use `parallel: matrix` to scan each as a separate job:

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

Adding a new image is one matrix entry. The Trivy `--input` flag scans a tarball from the build stage rather than pulling from a registry - the image doesn't need to be pushed yet.

### Scope limiting

Security scans only run on dev MRs and dev commits. Stage and prod are promotion pipelines - the code is identical to what already passed scanning on dev. Re-running SAST on a promotion MR is wasted compute.

Exception is IaC scanning, which runs on all environments because terraform configs can differ per environment (different instance sizes, different feature flags in tfvars).

### DAST against live stage

OWASP ZAP runs post-deploy against stage. Spiders the API for 5 minutes, then runs passive and active rules:

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

Stage-only is intentional. You need a deployed target, and you don't want ZAP hammering production.

## Pattern 7: Container builds with Kaniko

Pipeline builds Docker images? You've probably fought with Docker-in-Docker. DinD requires privileged mode on the runner, it's slow (Docker daemon every job), and it's a security surface you don't need.

Kaniko builds container images without a Docker daemon. Runs as a regular container - no privileges, no DinD service, no socket mounting.

### Build and push as separate jobs

Three stages: build (with `--no-push`), scan, then push. Keeps scanning in the critical path without requiring registry access:

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

`--no-push` builds the image and saves it as a tarball artifact. Trivy scans the tarball in the security stage. Only on commit pipelines - after tests, scans, and builds all pass - does the image get pushed:

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

### ECR auth in `.pre`

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

Downstream Kaniko jobs read this token and write their own `/kaniko/.docker/config.json`. The 60-minute expiry means the token never sits around longer than one pipeline run.

### Dual tagging

Every push tags both `latest` and `$CI_COMMIT_SHORT_SHA`. `latest` is convenient for dev workflows. The SHA tag gives you immutable, auditable references - you can always trace exactly which commit is running in each environment.

## Pattern 8: Automated waterfall promotion

After a successful deploy to `dev`, automatically create an MR to promote to `stage`. After stage succeeds, same thing for prod. Consistent, auditable promotion path without manual intervention.

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
    - echo "Approving MR !${CI_MERGE_REQUEST_IID} (dev -> stage) as approval bot..."
    - GITLAB_TOKEN="${GITLAB_APPROVER_TOKEN}" glab mr approve ${CI_MERGE_REQUEST_IID}
    - echo "Auto-merging MR !${CI_MERGE_REQUEST_IID} (dev -> stage) after successful pipeline..."
    - glab mr merge ${CI_MERGE_REQUEST_IID} --yes --squash=false --remove-source-branch=false
```

Code merges to dev → pipeline runs → `.post` stage creates MR (dev→stage) → stage MR pipeline runs all validations → on success, auto-merges → stage pipeline runs → creates MR (stage→prod) → same pattern.

`allow_failure: true` matters here - the MR creation will fail if one already exists, and that's fine.

## Pattern 9: Smart defaults

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

- `interruptible: true` by default - new commits cancel stale MR pipelines (with `workflow: auto_cancel`). Override to `false` for deploy jobs.
- `retry` on infrastructure failures - flaky runners shouldn't block your pipeline. But only retry on system failures, not script failures (that's a real bug).
- Short artifact expiry - 1 day for build artifacts, deploy jobs override to 30 days when needed.

## Pattern 10: Failure notifications and status dashboards

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
      curl -H "Content-Type: application/json" \
        -d "{\"text\": \"Pipeline failed in ${CI_PROJECT_NAME} (${CI_COMMIT_REF_NAME}): ${FAILED_JOB_NAME}\"}" \
        "$WEBHOOK_URL"
```

Only trigger notifications on deployment branches - nobody needs a Teams ping for a failing MR pipeline that's still in progress.

### Status dashboard

Beyond failure alerts, also send a status dashboard card showing the health of all three environments at a glance. Job queries the GitLab API for the latest pipeline status on each deployment branch and renders a compact Adaptive Card:

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
      # Each row: environment name, status icon, links to site + pipeline
```

Runs on both success and failure (controlled by rules). Team gets a single card showing whether dev, stage, and prod are all green - useful after promotions cascade through the pipeline.

## Pattern 11: Ephemeral sandbox environments

For complex features, spin up a complete sandbox env on MR pipelines. One click deploys infrastructure, backend, and frontend to an isolated environment:

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

`when: manual` is critical - you don't want every MR auto-provisioning cloud infra. Engineers opt-in when they need it. The `on_stop` linkage ensures GitLab shows a "Stop" button to tear it down.

## Pattern 12: Pipeline debug job

When a pipeline behaves unexpectedly - wrong environment, missing variables, rules not matching - you need visibility into what GitLab actually resolved at runtime. I keep a lightweight debug job in `.pre` that dumps the pipeline's state:

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

Runs on every pipeline. Costs under 5 seconds, uses no cache. When something goes wrong, the debug log is already there - no need to add a debug job after the fact and re-run.

`DEBUG_VARIABLES` is a curated list of the variables the pipeline actually uses. New variable in shared config? Add it here too. The CI_* dump catches everything GitLab sets automatically - commit info, MR metadata, runner tags, feature flags - which is invaluable when rules aren't behaving as expected.

---

End-to-end on a dev MR where only frontend files changed: change detection skips backend, container, infrastructure, and most security jobs. Pipeline finishes in 3-4 minutes instead of 20.

Modularize early, by domain (frontend, backend, infra, security) not by stage. Anchor everything (`&`/`*` within files, `!reference` across them). Make MR pipelines fast, commit pipelines thorough. Layer your security - five scans across two stages, advisory first then blocking, scan once on dev and promote with confidence. Build, scan, then push. Automate the boring stuff - promotion MRs, failure notifications, environment dashboards. Make pipelines debuggable - a 5-second debug job in `.pre` saves hours of troubleshooting when variables don't propagate or rules don't match. Design for the person after you. Clear stage names, organized includes, a README in `.gitlab/` so the next engineer isn't reverse-engineering yaml at 2am.
