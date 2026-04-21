---
title: "Per-MR Ephemeral GCP Environments: What We Learned"
date: "2026-04-19"
description: "Preview environments are a frontend cliché — doing them on real GCP infrastructure is a different beast. The pattern, the costs, and what we'd do differently."
tags: ["gcp", "cloud-run", "ci-cd", "preview-environments", "devops", "platform-engineering"]
---

# Per-MR Ephemeral GCP Environments: What We Learned

Preview environments are a solved problem on the frontend. Open a PR, a bot comments a URL, reviewers click around a static build on someone else's edge network. The infrastructure is invisible because there isn't any — it's HTML and JavaScript on a CDN.

That model breaks the moment a merge request touches anything real. A change that rewrites a Cloud Run service's environment variables, tweaks an IAM binding, reroutes traffic between backends, or flips a feature flag through infra config can't be reviewed from a description and a screenshot. The diff tells you what the code says it does. It doesn't tell you what the platform does when it runs.

On a previous platform team I worked on, we reviewed too many MRs by trusting the description — approve, merge, find out in staging that the change behaved differently against live-shaped infrastructure than the author assumed, spend an afternoon unwinding it. The fix wasn't more careful reviewers. The fix was giving reviewers a URL pointing at actual running infrastructure.

## The pattern we shipped

Every MR that changed application source code got its own ephemeral environment on GCP. Fully automatic — no opt-in label, no manual trigger, no "please spin up a review app" comment. Open the MR, and within a few minutes a Cloud Run service, a Cloud DNS record, and a Cloud Storage bucket for static assets existed at a URL shaped like `mr-1234.preview.example.com`.

The "every MR" part is what most teams flinch at. Noise, cost, runner time, quota. In practice we didn't see those problems, because the trigger was filtered by changed path. Docs-only MRs didn't spin up review apps. Neither did infrastructure-only MRs — if the diff lived entirely in `terraform/`, there was nothing in the application to preview. The trigger was for application source code, and only for application source code.

That path filter is load-bearing. Without it, "on every MR" is an expensive habit. With it, the signal-to-noise stayed high enough that nobody wanted an opt-in gate.

### What got provisioned, and what didn't

Per-MR, we stood up:

- **Cloud Run** — the application itself, built from the MR's branch.
- **Cloud DNS** — a per-MR subdomain so reviewers had a stable, shareable URL.
- **Cloud Storage** — a bucket for frontend static assets served alongside the Cloud Run service.

Per-MR, we deliberately did not stand up:

- **Cloud SQL.**

That last one is the most important architectural decision in the whole pattern. Every review app read from the shared dev Cloud SQL instance. Same tables, same schema, same data. No fresh database per MR.

The reasoning was hard-edged. A real Cloud SQL instance takes on the order of ten minutes to provision from cold. Idle databases cost real money — a production-shaped tier sitting idle behind a review app that gets clicked on three times is a line item. And a per-MR database is only useful if you migrate it, which means running pending schema migrations against a fresh DB on every spin-up.

The trade: review apps come up in a couple of minutes instead of fifteen, cost roughly nothing idle, and every reviewer can hit the same dev data the rest of the team is already looking at. What we give up is the ability to exercise schema migrations inside a review app — those get tested in staging and dev, not in preview. For a workload that's mostly app-layer changes against a reasonably stable schema, shared-read against dev was the right shape.

## Isolated state and the three-layer teardown

Every review app had its own Terraform statefile, addressed by MR number. Not a shared statefile with a namespace, not a module inside a bigger state — its own file, isolated, destroyable in one command without touching anything else.

That isolation is what made teardown a non-event. If an environment got stuck, misconfigured, or corrupted, `terraform destroy` against its statefile blew it away cleanly. You couldn't accidentally nuke a sibling environment because the statefile didn't know about any siblings.

Teardown ran in three layers:

**Layer 1 — MR-close trigger.** When an MR merged, closed, or was deleted, a CI job ran `terraform destroy` against its statefile. In the happy path, this was the whole story: MR closes, environment disappears inside a minute.

**Layer 2 — the 10-day cleanup cron.** CI jobs sometimes don't run cleanly. A runner dies mid-destroy. A transient GCP API error bails the job. A cron swept every ten days, found statefiles for closed MRs with live resources, and ran destroy against each. Most weeks it picked up nothing. Some weeks it caught two or three orphans.

**Layer 3 — manual escape hatch.** Because statefiles were addressable by MR number, an engineer could `terraform destroy` by hand against any MR's backend config. Break-glass for the rare case where both the trigger and the cron missed something.

Most preview-environment writeups stop at Layer 1. Layer 1 alone is fine until a runner dies at the wrong moment, and then you've got an environment nothing will clean up except a human who remembers it exists. Two and three are the difference between a pattern that works and one that accumulates orphans.

Per-MR ephemeral environments on Cloud Run, backed by shared-read Cloud SQL, with isolated Terraform statefiles and three layers of teardown — reviewers got real infrastructure to click on, orphans stayed rare, and the cost envelope stayed sane.
