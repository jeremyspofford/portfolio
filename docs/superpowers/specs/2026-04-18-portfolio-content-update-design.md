# Portfolio Content Update — DevOps Material from Current AWS Engagement

**Date:** 2026-04-18
**Scope:** New blog posts, hero copy revision, and resume content additions sourced from Jeremy's current Senior DevOps engagement. No structural, theme, or layout changes.

## Context

Jeremy is in a 90-day sprint (started 2026-04-14) to be interview-ready as a Senior DevOps / Platform Engineer by July 2026. Two known résumé filters work against him today: "no Kubernetes" and "light AWS." His current paid engagement is the source of meaningful AWS depth (Terragrunt, Lambda, multi-account, LocalStack-based local dev, CloudWatch alarms-as-code) — material that is not yet reflected on the portfolio.

The portfolio currently has:
- One published blog post (GitLab CI/CD pipelines)
- A hero with no AWS keyword surface, framed as a DevOps→ML pivot that misrepresents the immediate target role
- A resume entry for the current Senior DevOps role with no specific AWS-platform-engineering signal

This spec captures four blog posts, a hero rewrite, and a resume content update designed to close the AWS keyword gap and provide credible senior-platform-engineering signal.

## Anonymization Conventions

Two-layer rule, applied throughout:

1. **Employer (named).** Jeremy's employer is named on the existing resume per convention. Keep that.
2. **Client engagement (anonymized).** All client names, app names, product names, vendor names, internal lambda/module/service names, customer-facing domains, and vertical-specific identifiers from the current engagement are stripped from blog content, hero copy, and resume bullets.

When referring to the source environment, use neutral descriptors:
- "a production AWS environment I work in"
- "a recent client engagement"
- "a serverless platform I help maintain"

Technical specifics that are not identifying (AWS service names, version pins, error patterns, gotchas, account topology in the abstract) are kept — those are the value.

## 1. Hero Update

**File:** `src/components/Hero.tsx`

**Current copy** (literal):
> The best infrastructure disappears. 8 years of making systems boring-on-purpose in DevOps — shrinking a 30-minute pipeline to 2 by rebuilding change detection. Now turning that same discipline on the ML side — graph-based memory, learned retrieval, and inference routing between cloud providers and local GPUs.

**Replacement copy** (literal):
> The best infrastructure disappears. 8 years of making systems boring-on-purpose in DevOps — shrinking a 30-minute pipeline to 2 by rebuilding change detection. Currently designing multi-account AWS infrastructure with Terragrunt and Lambda across five environments.

**Rationale:**
- Adds AWS / Terragrunt / Lambda keyword surface (currently absent)
- Removes ML pivot framing (Jeremy's near-term target role is Senior DevOps / Platform Engineer; ML Platform Engineer is deferred long-term per his career plan)
- Preserves the distinctive opening and the 30→2 minute story

**Pullquote (no change in content):** Pullquote attributed to Jeremy's son must reflect age **5**. If the file currently shows a different age, correct it during implementation.

## 2. Blog Post Slate

Four posts, in publish order. Order is chosen to lead with the strongest narrative material first.

### Post 1 — *When Terraform Meets Reality: The Manually-Created Resource Problem*

- **Shape:** war-story essay
- **Length target:** 1200–1500 words
- **Beats:**
  1. Open with the moment a Terragrunt apply failed because state and reality disagreed
  2. Walk the import attempt and why it didn't cleanly resolve
  3. The pragmatic interim ("set `allow_failure: true` so the pipeline could merge")
  4. The eventual resolution: filtering manually-managed modules out of CI runs (`terragrunt run --all apply --filter '!internal-module-name'`)
  5. Three closing takeaways: (a) state is an aspiration, not a guarantee; (b) prefer exclusion to a fight when the cost-benefit favors it; (c) document and gate manually-managed resources so the next person knows
- **Anonymization:** source as "an AWS environment I help maintain"; use a generic descriptor ("an internal launcher Lambda") for the actual resource type
- **Authorship confirmed:** Jeremy

### Post 2 — *Per-MR Ephemeral GCP Environments: What We Learned*

- **Shape:** pattern-with-honest-tradeoffs
- **Length target:** 1200–1500 words
- **Source engagement:** previous client engagement on GCP (anonymized)
- **Beats:**
  1. Motivation: reviewers click around real infra, not screenshots or local repros
  2. The pattern (per-MR Cloud Run / managed services provisioned on each open MR)
  3. Shared-account-vs-isolated trade-off and why we chose what we chose
  4. Teardown reality (auto-destroy is scarier than it sounds for stateful resources; manual safeguards earn their keep)
  5. What we'd do differently
- **Anonymization:** "a previous client engagement on GCP / Cloud Run"; no client/app names
- **Authorship confirmed:** Jeremy
- **Reframe note:** This post was originally scoped as an AWS sandbox post. Rescoped to GCP/Cloud Run to match the work Jeremy actually owns.

### Post 3 — *A Layered Local AWS Dev Loop: LocalStack and SAM Hybrid*

- **Shape:** how-to with war-story sidebars
- **Length target:** 1000–1300 words
- **Beats:**
  1. Motivation: zero credentials on disk for the offline path, fast feedback, no AWS bill for unit tests
  2. Two modes by design: a fully-local mode using LocalStack (`npm run local`) and a hybrid mode (`npm run dev`) using SAM CLI bootstrapped against deployed AWS dev resources for richer integration testing
  3. Where each mode is the right choice, and the hand-off pattern
  4. The `s3_use_path_style = true` LocalStack gotcha — full sidebar; cost real hours and the docs do not surface it
  5. The SAM `--docker-network localstack-network` quirk for SAM-to-LocalStack networking
  6. What LocalStack still doesn't fake well, and how the hybrid mode covers the gap
- **Honesty constraint:** explicitly do NOT claim "fully offline." The setup is graduated.
- **Anonymization:** generic; this is an infrastructure pattern post
- **Authorship confirmed:** Jeremy

### Post 4 — *Monitoring & Observability for DevOps* (rewrite of existing draft)

- **Shape:** opinionated reference + concrete examples
- **Length target:** 1000–1200 words
- **Source:** rewrite of the existing draft at `/reference/blog-posts/` (currently generic theory)
- **Beats (replace generic theory with concrete CloudWatch-as-code patterns):**
  1. Frame: monitoring config is code; treat it like code
  2. Master enable/disable switches (e.g., `enableAllCloudWatchAlarms`) for environment-level control
  3. Metric math expressions for derived rates (errors / invocations × 100)
  4. Per-environment retention tiers (e.g., 30d prod / 14d stage)
  5. SNS routing to email and Teams webhooks
  6. Per-resource-type alarm patterns (Lambda errors/throttles/duration; API Gateway 4xx/5xx/latency; DynamoDB throttles/errors)
- **Anonymization:** generic; pattern post
- **Authorship confirmed:** Jeremy

### Deferred (not included in this slate, available as fast-follows)

- *Why I Don't Let Terraform Manage Lambda Code* — the `lifecycle.ignore_changes` pattern (authorship not yet confirmed; revisit before drafting)
- *Terragrunt Feature Flags vs Runtime Toggles*
- *Multi-Account AWS at Scale* — saved for after CKA so it can pair with Kubernetes content

## 3. Resume Update

**Files:** `src/data/experience/<current-role>.yml`, `src/data/skills/*.yml`, `src/data/certifications/*.yml`, `src/data/profile/main.yml`

Update target is the current Senior DevOps role only. Past roles are unchanged.

### 3a. New `key_deliverables[]` items (4 bullets, all under the current role)

Each is a `ProjectContent` per the existing schema (`{title, description, technologies, link?}`).

**Bullet 1 — Multi-account AWS with Terragrunt**
- title: `Multi-account AWS infrastructure with Terragrunt`
- description: `Designed and maintain Terragrunt modules across five environments (dev/stage/prod plus sandbox/local), with shared baseline modules and per-environment overrides.`
- technologies: `[Terragrunt, OpenTofu, AWS, Lambda, DynamoDB, S3, Cognito, API Gateway, GitLab CI]`

**Bullet 2 — Layered local AWS development**
- title: `Layered local AWS development with LocalStack and SAM`
- description: `Built a layered local development experience: a fully-local mode using LocalStack for offline iteration, and a hybrid mode using SAM CLI bootstrapped against deployed AWS dev resources for richer integration testing. Keeps cloud bills off engineers writing unit tests.`
- technologies: `[LocalStack, Docker Compose, Terragrunt, AWS SAM, AWS CLI]`

**Bullet 3 — Per-MR ephemeral preview environments (GCP)**
- title: `Per-merge-request preview environments on GCP`
- description: `On a previous client engagement, built per-merge-request preview environments on GCP / Cloud Run so reviewers could click around real infrastructure on each open MR instead of relying on screenshots or local repros.`
- technologies: `[GCP, Cloud Run, GitLab CI, Terraform]`
- *Note for implementation: confirm exact GCP services Jeremy used in that engagement before publishing the technologies array.*

**Bullet 4 — Observability-as-code with CloudWatch**
- title: `Observability-as-code with CloudWatch`
- description: `Treated CloudWatch alarms as code — error-rate metric math, per-environment retention tiers, master enable/disable switches, and SNS routing to email and Teams webhooks across multiple environments.`
- technologies: `[CloudWatch, SNS, Terraform, Teams]`

**Explicit non-bullets (do NOT add):**
- No "70-module" claim
- No "per-MR ephemeral AWS envs" claim (Jeremy did not build that on AWS)
- No "real-time data ingest pipeline" / IoT Core / Kinesis Firehose / EventBridge claims (not Jeremy's work)
- No provider-cache-warming claim (Jeremy not the owner; also too detailed for résumé)

### 3b. `technologies[]` additions on the current role

Append to the role-level technologies array (dedupe against existing): `Terragrunt, OpenTofu, LocalStack, AWS SAM, Cognito, KMS, Secrets Manager, ECR`

**Do NOT add:** `IoT Core, Kinesis Firehose, EventBridge` — not Jeremy's work in this engagement.

### 3c. Skills section additions

In `src/data/skills/`:

- **AWS Services category:** confirm/append items: `Lambda, DynamoDB, S3, Cognito, API Gateway, CloudWatch, IAM, KMS, Secrets Manager, ECR, SAM, SNS`
- **Infrastructure as Code category:** confirm/append: `Terraform, Terragrunt, OpenTofu`
- **New category — Local Development & Testing:** items: `LocalStack, Docker Compose, AWS SAM CLI, AWS CLI`

### 3d. Certifications addition

In `src/data/certifications/`:

Add one new entry using the existing schema (no schema change required):
- name: `AWS Certified Solutions Architect – Associate (SAA-C03)`
- issuer: `Amazon Web Services`
- date: `In Progress — target May 2026`
- active: `false`
- link / imageUrl: leave empty

**Do NOT add CKA** — not yet in active prep.

### 3e. Profile bio addition

In `src/data/profile/main.yml`:

Append to the end of the existing `bio` field, as a final sentence:
> Currently deepening AWS in production (Terragrunt, Lambda, multi-account) and starting Kubernetes labs in preparation for CKA later this year.

## 4. Build Sequence

Recommended order:

1. **Hero copy swap** (smallest change, keyword surface unblocks ATS scanning immediately)
2. **Resume YAML updates** in this order: bio addition → certifications → skills → role technologies → key_deliverables bullets → final ATS export check (regenerate PDF/Word/TXT)
3. **Blog Post 4** first (rewrite of existing draft — cheapest publish)
4. **Blog Post 1** (highest narrative pull)
5. **Blog Post 2** (GCP review-apps story)
6. **Blog Post 3** (LocalStack hybrid)

Posts may be drafted out of order if convenient, but publish order is 4 → 1 → 2 → 3.

## 5. Out of Scope (explicit non-goals)

- No design system / theme / color changes
- No layout or component restructure
- No projects-page changes
- No new pages or routes
- No CMS migration; resume stays YAML-file-backed
- No certification schema extension (`active: false` + free-text `date` is sufficient)
- No CKA-related content additions until CKA prep is actually underway
- No Kubernetes blog content until Kubernetes labs produce real material
- No content drawing on the current client's data ingestion / IoT pipeline / sensor work — not Jeremy's contribution and not anonymizable cleanly

## 6. Open Items for Implementation

These are confirmed-but-unverified-in-code; the implementer should check before writing:

1. Current state of `Hero.tsx` pullquote: confirm the age string says "5" or update.
2. Current `src/data/skills/` files: confirm AWS Services and Infrastructure as Code categories exist; confirm which items are already present before appending.
3. Current `src/data/profile/main.yml` bio: confirm exact final-sentence wording so the appended sentence flows naturally.
4. The exact set of GCP services used in the previous client engagement referenced in Bullet 3 — Jeremy to provide if the implementer cannot derive from existing portfolio content.
5. Existing reference draft for Post 4: locate the file in `/reference/blog-posts/` and confirm structure before rewriting.
