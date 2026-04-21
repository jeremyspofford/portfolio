# Portfolio Content Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 blog posts, replace the hero subtitle, and enrich the current Senior DevOps role on the resume with AWS-platform-engineering signal sourced (anonymized) from Jeremy's current client engagement.

**Architecture:** Pure content edits — Markdown blog posts plus YAML data updates plus one JSX subtitle swap. Next.js (App Router) reads the YAML files server-side via `src/lib/content.ts` and renders MDX blog posts via `next-mdx-remote`. No new components, routes, or schema changes.

**Tech Stack:** Next.js 16 (App Router) + TypeScript, Tailwind, MDX (next-mdx-remote, gray-matter), js-yaml file-backed content under `src/data/`.

**Spec:** `docs/superpowers/specs/2026-04-18-portfolio-content-update-design.md`

---

## Resume Status (last updated 2026-04-21)

### Completed — no action needed
- ✅ **Pre-flight**: spec + plan committed (`3bf4d24`); branch setup (working on `main` per user consent)
- ✅ **Phase 1 — Task 1**: Hero subtitle replaced (`3ed2b88`)
- ✅ **Phase 2 — Tasks 2-7**: All resume YAML updates (`76c6226` → `5908c7c`)
- ✅ **Scope expansion (verbal approval, outside original spec)**: enrichment of every past role + a Monitoring & Observability skill category + Terraform-docs deliverable consolidation (`18f7f8d` → `d35cb28`)
- ✅ **Phase 3 — Task 8**: Post 4 (Monitoring & Observability rewrite) published + metric-math follow-up fix (`487fe02` → `58ebcfc`)

**Last commit before pause:** `58ebcfc fix(blog): sharpen metric-math IF-guard explanation`

### Remaining — pick up here
- 🔲 **Phase 3 — Task 9**: Post 1 (When Terraform Meets Reality) — START HERE
- 🔲 **Phase 3 — Task 10**: Post 2 (Per-MR Ephemeral GCP Environments)
- 🔲 **Phase 3 — Task 11**: Post 3 (Layered Local AWS Dev Loop)
- 🔲 **Phase 4 — Task 12**: Final verification

### Captured Q&A (use during Phase 3)

**For Task 10 (Post 2 — GCP review-apps):** the GCP services used in that engagement were:
- Cloud Run (apps)
- Cloud SQL (database)
- Cloud DNS (per-MR subdomain assignment)
- Cloud Storage (frontend static assets)

User confirmed Cloud Storage (NOT AWS S3 — that was a paste typo). Use these in the post body and the post's tags as appropriate.

### How to resume in a fresh session

From the portfolio repo (`cd ~/workspace/portfolio`), prompt Claude with:

> "Pick up the portfolio content update plan from where we left off. The plan is at `docs/superpowers/plans/2026-04-19-portfolio-content-update.md` — read the Resume Status section at the top first. Resume from Phase 3 / Task 9 (Post 1 — When Terraform Meets Reality) using the superpowers:subagent-driven-development skill. Work directly on `main` per prior consent."

The fresh session will read the plan + the Resume Status block and dispatch the next implementer.

### Anonymization reminder (still in force)

No client / app / vendor / product names from any client engagement. Forbidden tokens: `ft-quoting`, `alertventure`, `dematic`, `tripo`, `drone`, `trajectory`, `simulator`, `usdz`, `avfftdev`. Source environments are referred to generically ("an AWS environment I work in," "a previous GCP engagement"). The two feedback memories at `~/.claude/projects/-home-jeremy-workspace-portfolio/memory/` capture the rule and the rationale.

---

## File Structure

| Path | Action | Responsibility |
|------|--------|----------------|
| `src/components/Hero.tsx` | Modify (lines 23–26) | Replace subtitle `<p>` only; pullquote stays |
| `src/data/profile/main.yml` | Modify (`bio` field) | Append one sentence about current AWS depth + K8s labs |
| `src/data/certifications/aws_saa_inprogress.yml` | **Create** | SAA-C03 in-progress entry; `active: false` |
| `src/data/skills/aws.yml` | Modify (`items[]`) | Append missing AWS services |
| `src/data/skills/iac.yml` | Modify (`items[]`) | Confirm Terraform/Terragrunt/OpenTofu present |
| `src/data/skills/local_dev.yml` | **Create** | New "Local Development & Testing" category |
| `src/data/experience/vividcloud.yml` | Modify (`technologies[]` + `key_deliverables[]`) | Append tech tags and 4 new bullets |
| `src/content/posts/monitoring-observability-devops.md` | **Create** | Post 4 — rewrite of reference draft with CloudWatch-as-code patterns |
| `src/content/posts/when-terraform-meets-reality.md` | **Create** | Post 1 — manually-created resources saga |
| `src/content/posts/per-mr-ephemeral-gcp-environments.md` | **Create** | Post 2 — GCP review-apps story |
| `src/content/posts/layered-local-aws-dev-loop.md` | **Create** | Post 3 — LocalStack + SAM hybrid |

**Reference (read-only):** `reference/blog-posts/monitoring-observability-devops.md` is the source draft for Post 4.

**Anonymization rule (applies to every file touched):** No client names, app names, vendor names, internal lambda/module/service names, or vertical-specific identifiers from the current client engagement. Employer name (VividCloud) stays per existing convention. Detailed convention: see spec §"Anonymization Conventions."

---

## Pre-flight

- [ ] **Step 0.1: Confirm working directory and clean tree**

```bash
cd /home/jeremy/workspace/portfolio
git status
git branch --show-current
```

Expected: branch `main`, working tree clean except for the untracked spec file at `docs/superpowers/specs/2026-04-18-portfolio-content-update-design.md` and this plan file.

- [ ] **Step 0.2: Commit the spec and plan docs**

```bash
git add docs/superpowers/specs/2026-04-18-portfolio-content-update-design.md docs/superpowers/plans/2026-04-19-portfolio-content-update.md
git commit -m "docs: add portfolio content update spec and plan"
```

- [ ] **Step 0.3: Start dev server in a separate terminal**

```bash
cd /home/jeremy/workspace/portfolio && npm run dev
```

Leave it running for the duration of the plan. We'll hit `/`, `/resume`, and `/blog` repeatedly to verify changes.

---

## Phase 1 — Hero Copy Update

### Task 1: Replace hero subtitle paragraph

**Files:**
- Modify: `src/components/Hero.tsx:23-26`

- [ ] **Step 1.1: Read the current Hero.tsx and confirm line range**

Open `src/components/Hero.tsx`. Find the subtitle paragraph that currently reads:

> "The best infrastructure disappears. 8 years of making systems boring-on-purpose in DevOps — shrinking a 30-minute pipeline to 2 by rebuilding change detection. Now turning that same discipline on the ML side — graph-based memory, learned retrieval, and inference routing between cloud providers and local GPUs."

Note the exact JSX structure (an `<em>` wraps "boring-on-purpose").

- [ ] **Step 1.2: Replace the inner text of the `<p>` element**

The new content keeps the `<em>` wrapper around "boring-on-purpose" exactly as before. Replace the `<p>` body with:

```jsx
<p className="text-[17px] leading-relaxed text-text-body max-w-[65ch]">
  The best infrastructure disappears. 8 years of making systems{" "}
  <em className="italic text-text-primary font-medium">boring-on-purpose</em>{" "}
  in DevOps — shrinking a 30-minute pipeline to 2 by rebuilding change detection. Currently designing multi-account AWS infrastructure with Terragrunt and Lambda across five environments.
</p>
```

Do NOT touch the pullquote `<blockquote>` below it — it already uses `{getKidAge()}` and renders correctly.

- [ ] **Step 1.3: Verify in browser**

Visit `http://localhost:3000/`. Expected: the new subtitle text appears, "boring-on-purpose" is still emphasized, the pullquote below still says "5-year-old."

- [ ] **Step 1.4: Build check**

```bash
npm run build
```

Expected: build succeeds with no TypeScript errors related to Hero.tsx.

- [ ] **Step 1.5: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat(hero): replace subtitle with AWS keyword surface, drop ML pivot framing"
```

---

## Phase 2 — Resume YAML Updates

### Task 2: Append bio sentence

**Files:**
- Modify: `src/data/profile/main.yml` (`bio` field)

- [ ] **Step 2.1: Read the current bio**

```bash
cat src/data/profile/main.yml
```

Note the exact closing of the current `bio` field so the appended sentence flows naturally.

- [ ] **Step 2.2: Append one sentence to the `bio` field**

The new sentence (verbatim):

> Currently deepening AWS in production (Terragrunt, Lambda, multi-account) and starting Kubernetes labs in preparation for CKA later this year.

Append it after the existing bio text, separated by a single space (since `bio` is one paragraph).

- [ ] **Step 2.3: Verify resume page renders**

Visit `http://localhost:3000/resume`. Expected: the bio paragraph ends with the new sentence; no rendering errors.

- [ ] **Step 2.4: Commit**

```bash
git add src/data/profile/main.yml
git commit -m "feat(resume): append AWS depth + Kubernetes labs sentence to bio"
```

---

### Task 3: Add SAA-C03 in-progress certification

**Files:**
- Create: `src/data/certifications/aws_saa_inprogress.yml`

- [ ] **Step 3.1: Inspect existing certification schema**

```bash
cat src/data/certifications/gcp_ace.yml
```

Confirms the field set: `PK`, `SK`, `content.{name, issuer, date, issuedDate?, expirationDate?, active, link?, imageUrl?}`.

- [ ] **Step 3.2: Create the new SAA-C03 file**

Write to `src/data/certifications/aws_saa_inprogress.yml`:

```yaml
PK: CERTIFICATION
SK: AWS_SAA_INPROGRESS_2026
content:
  name: AWS Certified Solutions Architect – Associate (SAA-C03)
  issuer: Amazon Web Services
  date: In Progress — target May 2026
  active: false
```

Omit `link`, `imageUrl`, `issuedDate`, `expirationDate` — none apply yet.

- [ ] **Step 3.3: Verify resume certifications section**

Visit `http://localhost:3000/resume`. Expected: a new certification entry appears with the in-progress label. No render errors.

- [ ] **Step 3.4: Commit**

```bash
git add src/data/certifications/aws_saa_inprogress.yml
git commit -m "feat(resume): add SAA-C03 as in-progress certification"
```

---

### Task 4: Update skills categories

**Files:**
- Modify: `src/data/skills/aws.yml`
- Modify: `src/data/skills/iac.yml`
- Create: `src/data/skills/local_dev.yml`

- [ ] **Step 4.1: Read current AWS and IaC skills**

```bash
cat src/data/skills/aws.yml src/data/skills/iac.yml
```

Note the existing items so we only append what's missing.

- [ ] **Step 4.2: Append missing items to AWS Services**

Target final `items` (dedupe against current — append only those not present): `IAM, EC2, S3, Lambda, RDS, DynamoDB, CloudFront, API Gateway, Cognito, CloudWatch, KMS, Secrets Manager, ECR, SAM, SNS`.

Edit `src/data/skills/aws.yml` to add any of `KMS, Secrets Manager, ECR, SAM, SNS` not already present.

**Do NOT add:** `IoT Core, Kinesis Firehose, EventBridge` (not Jeremy's work).

- [ ] **Step 4.3: Confirm IaC items**

Open `src/data/skills/iac.yml`. Ensure `items[]` includes `Terraform, Terragrunt, OpenTofu`. Add any missing.

- [ ] **Step 4.4: Create new Local Development & Testing skill file**

Write to `src/data/skills/local_dev.yml`:

```yaml
PK: SKILL
SK: LOCAL_DEV
content:
  category: Local Development & Testing
  proficiency: 80
  items:
    - LocalStack
    - Docker Compose
    - AWS SAM CLI
    - AWS CLI
  icon: terminal
  description: Layered local development environments that let engineers iterate fast without cloud credentials or cloud bills.
```

(If `icon: terminal` does not match an existing icon convention, copy the icon value from another skill file like `linux.yml` or `containers.yml`. Match what's already used.)

- [ ] **Step 4.5: Verify skills section renders**

Visit `http://localhost:3000/resume`. Expected: AWS Services shows the new items, IaC shows all three tools, a new "Local Development & Testing" category appears with 4 items.

- [ ] **Step 4.6: Commit**

```bash
git add src/data/skills/aws.yml src/data/skills/iac.yml src/data/skills/local_dev.yml
git commit -m "feat(resume): expand AWS/IaC skills, add Local Development & Testing category"
```

---

### Task 5: Add tech tags to current role

**Files:**
- Modify: `src/data/experience/vividcloud.yml` (`content.technologies[]`)

- [ ] **Step 5.1: Read current vividcloud.yml**

```bash
cat src/data/experience/vividcloud.yml
```

Note current contents of `content.technologies[]`.

- [ ] **Step 5.2: Append missing tech tags**

Append (dedupe against current): `Terragrunt, OpenTofu, LocalStack, AWS SAM, Cognito, KMS, Secrets Manager, ECR`.

**Do NOT add:** `IoT Core, Kinesis Firehose, EventBridge`.

- [ ] **Step 5.3: Verify resume role section**

Visit `http://localhost:3000/resume`. Expected: under the current Senior DevOps role, the technologies list shows the additions.

- [ ] **Step 5.4: Commit**

```bash
git add src/data/experience/vividcloud.yml
git commit -m "feat(resume): expand current-role technology tags with AWS depth"
```

---

### Task 6: Add four key_deliverables to current role

**Files:**
- Modify: `src/data/experience/vividcloud.yml` (`content.key_deliverables[]`)

- [ ] **Step 6.1: Identify insertion point**

The `key_deliverables[]` array exists in the file (per existing schema in `tyler_devops.yml` it's an optional list of `ProjectContent` items). If it doesn't exist on `vividcloud.yml`, add it.

- [ ] **Step 6.2: Append the four bullets — verbatim copy**

Append these four entries to `key_deliverables[]`:

```yaml
- title: Multi-account AWS infrastructure with Terragrunt
  description: Designed and maintain Terragrunt modules across five environments (dev/stage/prod plus sandbox/local), with shared baseline modules and per-environment overrides.
  technologies:
    - Terragrunt
    - OpenTofu
    - AWS
    - Lambda
    - DynamoDB
    - S3
    - Cognito
    - API Gateway
    - GitLab CI

- title: Layered local AWS development with LocalStack and SAM
  description: "Built a layered local development experience: a fully-local mode using LocalStack for offline iteration, and a hybrid mode using SAM CLI bootstrapped against deployed AWS dev resources for richer integration testing. Keeps cloud bills off engineers writing unit tests."
  technologies:
    - LocalStack
    - Docker Compose
    - Terragrunt
    - AWS SAM
    - AWS CLI

- title: Per-merge-request preview environments on GCP
  description: On a previous client engagement, built per-merge-request preview environments on GCP / Cloud Run so reviewers could click around real infrastructure on each open MR instead of relying on screenshots or local repros.
  technologies:
    - GCP
    - Cloud Run
    - GitLab CI
    - Terraform

- title: Observability-as-code with CloudWatch
  description: "Treated CloudWatch alarms as code — error-rate metric math, per-environment retention tiers, master enable/disable switches, and SNS routing to email and Teams webhooks across multiple environments."
  technologies:
    - CloudWatch
    - SNS
    - Terraform
    - Teams
```

**Open item from spec §6 #4**: confirm the GCP-bullet's `technologies` list matches what was actually used in that previous engagement. If unsure, ask Jeremy before publishing — the current list (`GCP, Cloud Run, GitLab CI, Terraform`) is a reasonable default.

- [ ] **Step 6.3: Verify on the resume page**

Visit `http://localhost:3000/resume`. Expected: under the current Senior DevOps role, four new deliverable cards appear with the listed titles and technology pills.

- [ ] **Step 6.4: Commit**

```bash
git add src/data/experience/vividcloud.yml
git commit -m "feat(resume): add four AWS-platform-engineering deliverables to current role"
```

---

### Task 7: Resume page sanity check + ATS export verification

**Files:** none (verification only)

- [ ] **Step 7.1: Visual smoke on `/resume`**

Visit `http://localhost:3000/resume`. Scroll the entire page. Confirm:
- Bio paragraph ends with the new AWS/Kubernetes-labs sentence
- New SAA-C03 in-progress certification renders
- AWS Services category includes the appended items; new "Local Development & Testing" category appears
- Current role shows new tech tags + four new deliverable cards
- No layout breaks, no overlapping text, no missing icons

- [ ] **Step 7.2: PDF export**

On `/resume`, click the PDF download button. Open the resulting file. Confirm:
- All four new deliverables appear under the current role
- Bio sentence appears
- SAA-C03 cert appears
- ATS-friendly formatting preserved (no garbled fonts, no overlapping rows)

- [ ] **Step 7.3: Word and TXT exports**

Click the Word (`.docx`) download. Open it; confirm same content as PDF.
Click the TXT download. Open it; confirm same content.

- [ ] **Step 7.4: Anonymization audit**

```bash
grep -irE "(ft-quoting|alertventure|dematic|tripo|drone|trajectory|simulator|usdz)" src/data/ src/components/Hero.tsx src/content/posts/
```

Expected: no matches. (The blog post directory will be empty until Phase 3, but checking now sets the baseline.)

- [ ] **Step 7.5: Phase commit**

If exports look wrong (formatting issue), pause and surface to user. Otherwise nothing to commit — this task is verification only. Phase 2 ends here.

---

## Phase 3 — Blog Posts (publish order: 4 → 1 → 2 → 3)

Each blog post task is structured the same way: gather source, draft, save with frontmatter, verify renders, anonymization audit, commit.

**Length targets are guidelines** — don't pad or cut artificially. Aim for the lower bound when in doubt.

**Drafting note for executor**: blog post drafting is a longer step (~30–60 min per post) than the typical 2–5 min plan step. That's expected; do not compress beat coverage to fit.

---

### Task 8: Post 4 — Monitoring & Observability rewrite

**Files:**
- Read source: `reference/blog-posts/monitoring-observability-devops.md`
- Read source (for CloudWatch-as-code patterns): `/home/jeremy/workspace/alertventure/ft-quoting/infrastructure/modules/monitoring/` (alarms-lambda.tf, alarms-apigw.tf, alarms-dynamodb.tf), `/home/jeremy/workspace/alertventure/ft-quoting/infrastructure/live/{prod,stage}/monitoring/terragrunt.hcl`
- Create: `src/content/posts/monitoring-observability-devops.md`

- [ ] **Step 8.1: Read the existing reference draft**

```bash
cat /home/jeremy/workspace/portfolio/reference/blog-posts/monitoring-observability-devops.md
```

Identify which sections are generic theory (replace) vs. structurally useful (keep with concrete examples).

- [ ] **Step 8.2: Gather concrete CloudWatch-as-code patterns from ft-quoting**

Read these files for real, anonymizable patterns:

```bash
cat /home/jeremy/workspace/alertventure/ft-quoting/infrastructure/modules/monitoring/alarms-lambda.tf
cat /home/jeremy/workspace/alertventure/ft-quoting/infrastructure/modules/monitoring/alarms-apigw.tf
cat /home/jeremy/workspace/alertventure/ft-quoting/infrastructure/modules/monitoring/alarms-dynamodb.tf
ls /home/jeremy/workspace/alertventure/ft-quoting/infrastructure/live/prod/monitoring/
```

Note: master switch flag name (e.g., `enableAllCloudWatchAlarms`), metric math expression for derived rates, retention tier values, SNS routing structure. Strip any client-specific resource names from snippets before using them in the post.

- [ ] **Step 8.3: Draft the post**

Write to `src/content/posts/monitoring-observability-devops.md`:

```markdown
---
title: "Monitoring and Observability in Modern DevOps Environments"
date: "2026-04-19"
description: "Treat your monitoring config like code. CloudWatch alarms as Terraform, metric math for derived rates, per-environment retention tiers, and SNS routing patterns from a real production AWS environment."
tags: ["monitoring", "observability", "devops", "aws", "cloudwatch", "terraform"]
---

[Body — follow spec §"Post 4" beats:
1. Frame: monitoring config is code; treat it like code
2. Master enable/disable switches (e.g., enableAllCloudWatchAlarms) for environment-level control
3. Metric math expressions for derived rates (errors / invocations × 100)
4. Per-environment retention tiers (e.g., 30d prod / 14d stage)
5. SNS routing to email and Teams webhooks
6. Per-resource-type alarm patterns (Lambda errors/throttles/duration; API Gateway 4xx/5xx/latency; DynamoDB throttles/errors)

Length: 1000–1200 words.

Use anonymized phrasing — no client/app/vendor names. Refer to source as "an AWS environment I work in."

Include 2–4 short code blocks of Terraform HCL showing the actual alarm-as-code patterns (master switch boolean, metric math, alarm definition).]
```

Replace the `[Body …]` block with the actual post content.

- [ ] **Step 8.4: Verify the post renders**

Visit `http://localhost:3000/blog`. Expected: the post appears in the list.
Visit `http://localhost:3000/blog/monitoring-observability-devops`. Expected: the post renders with title, date, description, body, code blocks syntax-highlighted.

- [ ] **Step 8.5: Anonymization audit on the new post**

```bash
grep -iE "(ft-quoting|alertventure|dematic|tripo|drone|trajectory|simulator|usdz|<any-internal-lambda-name>)" src/content/posts/monitoring-observability-devops.md
```

Expected: no matches.

- [ ] **Step 8.6: Build check**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 8.7: Commit**

```bash
git add src/content/posts/monitoring-observability-devops.md
git commit -m "feat(blog): publish Monitoring and Observability post with CloudWatch-as-code patterns"
```

---

### Task 9: Post 1 — When Terraform Meets Reality

**Files:**
- Read source: `/home/jeremy/workspace/alertventure/ft-quoting/.gitlab-ci.yml`, `.gitlab/ci/infrastructure.gitlab-ci.yml`, and the commits referenced below
- Create: `src/content/posts/when-terraform-meets-reality.md`

- [ ] **Step 9.1: Gather source material from ft-quoting**

```bash
cd /home/jeremy/workspace/alertventure/ft-quoting
git log --all --oneline | grep -iE "(manual|import|simulator|filter|allow_failure|bypass)"
git show 6eac4d99   # the import commit
git show 69f3f58e   # the allow_failure: true commit
git show b643c5c2   # the --filter resolution commit
grep -r "filter" .gitlab/ci/ infrastructure/ | head -20
cd /home/jeremy/workspace/portfolio
```

Capture: the literal `--filter '!...'` syntax (anonymize the module name in the post), the `allow_failure: true` line in CI, and the import block that didn't resolve cleanly.

- [ ] **Step 9.2: Draft the post**

Write to `src/content/posts/when-terraform-meets-reality.md`:

```markdown
---
title: "When Terraform Meets Reality: The Manually-Created Resource Problem"
date: "2026-04-19"
description: "A war story about Terraform state disagreeing with the AWS console — the import attempt that didn't resolve, the allow-failure interim, and why filtering manually-managed resources out of CI was the right call."
tags: ["terraform", "terragrunt", "aws", "devops", "iac", "war-stories"]
---

[Body — follow spec §"Post 1" beats:
1. Open with the moment a Terragrunt apply failed because state and reality disagreed
2. Walk the import attempt and why it didn't cleanly resolve
3. The pragmatic interim ("set allow_failure: true so the pipeline could merge")
4. The eventual resolution: filtering manually-managed modules out of CI runs (terragrunt run --all apply --filter '!internal-module-name')
5. Three closing takeaways: (a) state is an aspiration, not a guarantee; (b) prefer exclusion to a fight when cost-benefit favors it; (c) document and gate manually-managed resources so the next person knows

Length: 1200–1500 words.

Anonymize: source is "an AWS environment I help maintain"; the resource is "an internal launcher Lambda" (or similar generic descriptor). Show the literal --filter syntax and the literal allow_failure: true line as code blocks; do NOT show the literal lambda name.]
```

Replace the `[Body …]` block with the actual post content.

- [ ] **Step 9.3: Verify the post renders**

Visit `http://localhost:3000/blog/when-terraform-meets-reality`. Expected: renders cleanly.

- [ ] **Step 9.4: Anonymization audit**

```bash
grep -iE "(ft-quoting|alertventure|dematic|tripo|drone|trajectory|simulator|usdz)" src/content/posts/when-terraform-meets-reality.md
```

Expected: no matches. **Pay special attention to the `--filter` example** — must use a generic placeholder, not the real module name.

- [ ] **Step 9.5: Build check**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 9.6: Commit**

```bash
git add src/content/posts/when-terraform-meets-reality.md
git commit -m "feat(blog): publish 'When Terraform Meets Reality' war story"
```

---

### Task 10: Post 2 — Per-MR Ephemeral GCP Environments

**Files:**
- Source material: Jeremy's recall of the previous client engagement; no repo to grep against
- Create: `src/content/posts/per-mr-ephemeral-gcp-environments.md`

- [ ] **Step 10.1: Gather what's needed from Jeremy (interactive)**

This post is sourced from a previous client engagement; there's no repo to grep. Before drafting, ask Jeremy 3 specific questions to ground the post:
1. What GCP services were involved beyond Cloud Run? (Postgres? Cloud SQL? Pub/Sub? Memorystore?)
2. What was the trigger — every PR open, or PR-with-label?
3. What broke the most often, and how was teardown actually handled?

If executing as a subagent, surface these to Jeremy through the parent agent before writing.

- [ ] **Step 10.2: Draft the post**

Write to `src/content/posts/per-mr-ephemeral-gcp-environments.md`:

```markdown
---
title: "Per-MR Ephemeral GCP Environments: What We Learned"
date: "2026-04-19"
description: "Preview environments are a frontend cliché — doing them on real GCP infrastructure is a different beast. The pattern, the costs, and what we'd do differently."
tags: ["gcp", "cloud-run", "ci-cd", "preview-environments", "devops", "platform-engineering"]
---

[Body — follow spec §"Post 2" beats:
1. Motivation: reviewers click around real infra, not screenshots or local repros
2. The pattern (per-MR Cloud Run / managed services provisioned on each open MR)
3. Shared-account-vs-isolated trade-off and why we chose what we chose
4. Teardown reality (auto-destroy is scarier than it sounds for stateful resources; manual safeguards earn their keep)
5. What we'd do differently

Length: 1200–1500 words.

Anonymize: "a previous client engagement on GCP / Cloud Run." No client/product names.]
```

- [ ] **Step 10.3: Verify the post renders**

Visit `http://localhost:3000/blog/per-mr-ephemeral-gcp-environments`. Expected: renders cleanly.

- [ ] **Step 10.4: Anonymization audit**

```bash
grep -iE "(ft-quoting|alertventure|dematic|tripo|drone|trajectory|simulator|usdz)" src/content/posts/per-mr-ephemeral-gcp-environments.md
```

Expected: no matches.

- [ ] **Step 10.5: Build check**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 10.6: Commit**

```bash
git add src/content/posts/per-mr-ephemeral-gcp-environments.md
git commit -m "feat(blog): publish 'Per-MR Ephemeral GCP Environments' pattern post"
```

---

### Task 11: Post 3 — Layered Local AWS Dev Loop

**Files:**
- Read source: `/home/jeremy/workspace/alertventure/ft-quoting/apps/server/docker-compose.yml`, `/home/jeremy/workspace/alertventure/ft-quoting/infrastructure/live/localstack/localstack.hcl`, `/home/jeremy/workspace/alertventure/ft-quoting/apps/server/package.json` (for `npm run local` and `npm run dev` script definitions)
- Create: `src/content/posts/layered-local-aws-dev-loop.md`

- [ ] **Step 11.1: Gather the actual local-dev configuration**

```bash
cat /home/jeremy/workspace/alertventure/ft-quoting/apps/server/docker-compose.yml
cat /home/jeremy/workspace/alertventure/ft-quoting/infrastructure/live/localstack/localstack.hcl
grep -A1 "\"local\"\\|\"dev\"" /home/jeremy/workspace/alertventure/ft-quoting/apps/server/package.json
```

Capture: the LocalStack services list, the `s3_use_path_style = true` setting, the `--docker-network localstack-network` SAM flag, the script definitions for both modes.

- [ ] **Step 11.2: Draft the post**

Write to `src/content/posts/layered-local-aws-dev-loop.md`:

```markdown
---
title: "A Layered Local AWS Dev Loop: LocalStack and SAM Hybrid"
date: "2026-04-19"
description: "Why we built two local-dev modes for the same backend — fully-offline LocalStack for unit-test loops, and a SAM hybrid that hits real AWS dev resources when integration tests demand it. Plus the gotchas that cost us hours."
tags: ["aws", "localstack", "sam", "local-development", "developer-experience", "devops"]
---

[Body — follow spec §"Post 3" beats:
1. Motivation: zero credentials on disk for the offline path, fast feedback, no AWS bill for unit tests
2. Two modes by design: a fully-local mode using LocalStack (`npm run local`) and a hybrid mode (`npm run dev`) using SAM CLI bootstrapped against deployed AWS dev resources for richer integration testing
3. Where each mode is the right choice, and the hand-off pattern
4. The s3_use_path_style = true LocalStack gotcha — full sidebar; cost real hours and the docs do not surface it
5. The SAM --docker-network localstack-network quirk for SAM-to-LocalStack networking
6. What LocalStack still doesn't fake well, and how the hybrid mode covers the gap

Length: 1000–1300 words.

Be honest — explicitly do NOT claim "fully offline." The setup is graduated.

Show the docker-compose stanza for LocalStack, the localstack.hcl provider block, the s3_use_path_style line, and the SAM command with --docker-network — all as code blocks. Anonymize any service/lambda names.]
```

- [ ] **Step 11.3: Verify the post renders**

Visit `http://localhost:3000/blog/layered-local-aws-dev-loop`. Expected: renders cleanly.

- [ ] **Step 11.4: Anonymization audit**

```bash
grep -iE "(ft-quoting|alertventure|dematic|tripo|drone|trajectory|simulator|usdz)" src/content/posts/layered-local-aws-dev-loop.md
```

Expected: no matches.

- [ ] **Step 11.5: Build check**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 11.6: Commit**

```bash
git add src/content/posts/layered-local-aws-dev-loop.md
git commit -m "feat(blog): publish 'A Layered Local AWS Dev Loop' how-to with LocalStack/SAM gotchas"
```

---

## Phase 4 — Final Verification

### Task 12: Production build + visual smoke + final anonymization sweep

**Files:** none (verification only)

- [ ] **Step 12.1: Full production build**

```bash
npm run build
```

Expected: succeeds end-to-end with no warnings about missing pages or broken MDX.

- [ ] **Step 12.2: Run the test suite**

```bash
npm run test
```

Expected: all existing tests pass. (No new tests added — content updates don't have test surface.)

- [ ] **Step 12.3: Visual smoke pass on every touched surface**

Visit each in the dev browser:
- `/` — confirm new hero subtitle
- `/resume` — confirm bio sentence, SAA-C03 cert, expanded skills, new Local Development & Testing category, new tech tags on current role, four new deliverable cards
- `/blog` — confirm all four new posts appear in the index in the expected order
- `/blog/monitoring-observability-devops`, `/blog/when-terraform-meets-reality`, `/blog/per-mr-ephemeral-gcp-environments`, `/blog/layered-local-aws-dev-loop` — each renders with title, date, body, code blocks syntax-highlighted

- [ ] **Step 12.4: Final anonymization sweep across the whole repo**

```bash
grep -irE "(ft-quoting|alertventure|dematic|tripo|drone|trajectory|simulator|usdz|avfftdev)" \
  src/components/Hero.tsx src/data/ src/content/posts/
```

Expected: zero matches.

- [ ] **Step 12.5: Resume export sanity check (final)**

Visit `/resume`, click PDF / Word / TXT in turn. Open each. Confirm everything from the dev page is present in each format. ATS-friendly formatting preserved.

- [ ] **Step 12.6: Surface to user for review**

Stop here. Summarize: what shipped, what surfaces were verified, any open items from the spec §6 that are still unresolved (notably: the GCP-bullet `technologies` array confirmation if not done in Step 6.2, and any anonymization edge cases the executor flagged). Wait for explicit "ship it" before pushing.

---

## Notes for Executor

- **Subagent-driven execution is recommended** for this plan. Each phase commits independently; phases 1, 2, 3 (each post), and 4 are natural review checkpoints.
- **Drafting prose** for the four blog posts is the bulk of execution time. Each post is a 30–60 minute drafting step. Don't rush.
- **Anonymization is non-negotiable.** When in doubt, use a generic placeholder and ask Jeremy. The repeated `grep` audits at the end of each post task exist because anonymization slip-ups in published content are expensive to walk back.
- **If a verification step fails**, stop and surface to user — do not patch around it. Build failures in a Next.js content site are usually frontmatter or MDX-syntax issues; show the error to the user.
- **Skill references:** for prose drafting, no specific skill is mandatory; for verification discipline, see @superpowers:verification-before-completion before claiming any task done.
