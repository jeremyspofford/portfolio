---
title: "Review Apps in GitLab"
date: "2025-01-14"
description: "Frontend preview environments are easy. The same pattern on actual GCP backend infrastructure is a different beast - per-MR Cloud Run, shared dev Cloud SQL, isolated terraform state, three-layer teardown."
tags: ["gcp", "cloud-run", "ci-cd", "preview-environments", "devops", "platform-engineering"]
---

# Review Apps in GitLab - GCP Example

Preview envs are basically free on the frontend. Open a PR, a bot drops a URL, reviewers click around a static build on a CDN. There's no infrastructure because there isn't any - just HTML and JS sitting on someone else's edge network.

That falls apart the moment an MR touches anything real. A diff that rewrites a Cloud Run service's env vars, tweaks an IAM binding, reroutes traffic between backends, or flips a feature flag through infra config - that can't be reviewed from a description and a screenshot. The diff tells you what the code says it does. It doesn't tell you what the platform does when it runs.

On a previous platform team I worked on, we approved too many MRs by trusting the description, then watched them behave differently against live-shaped infrastructure than the author assumed and spent an afternoon unwinding it. The fix wasn't more careful reviewers. The fix was giving reviewers a URL pointing at actual running infrastructure.

## What we shipped

Every MR that changed application source got its own ephemeral env on GCP. Fully automatic - no opt-in label, no manual trigger, no "please spin up a review app" comment in the MR. Open it, and within a couple minutes a Cloud Run service, a Cloud DNS record, and a Cloud Storage bucket existed at a URL like `mr-1234.preview.example.com`.

"Every MR" is the part most teams flinch at. Cost, runner time, quota. In practice we didn't see those problems, because the trigger was filtered by changed path. Docs-only MRs didn't spin up review apps. Neither did infrastructure-only MRs - if the diff lived entirely in `terraform/`, there was nothing in the application to preview. Trigger was for application source code, only for application source code.

That path filter is load-bearing. Without it, "on every MR" is an expensive habit. With it, the signal-to-noise stayed high enough that nobody wanted an opt-in gate.

### What got provisioned, and what didn't

Per-MR, we stood up:

- **Cloud Run** - the application itself, built from the MR's branch
- **Cloud DNS** - a per-MR subdomain so reviewers had a stable, shareable URL
- **Cloud Storage** - a bucket for frontend static assets served alongside Cloud Run

Per-MR, we deliberately did NOT stand up:

- **Cloud SQL**

That last one is the most important call we made.

Every review app read from the shared dev Cloud SQL instance. Same tables, same schema, same data. No fresh database per MR.

Reasoning was hard-edged. A real Cloud SQL instance takes about ten minutes to provision from cold. Idle databases cost real money - a production-shaped tier sitting idle behind a review app that gets clicked three times is a line item. And a per-MR database is only useful if you migrate it, which means running pending schema migrations against a fresh DB on every spin-up.

The trade: review apps came up in a couple minutes instead of fifteen, cost roughly nothing idle, and every reviewer hit the same dev data the rest of the team was already looking at. What we gave up was exercising schema migrations inside a review app - those got tested in staging and dev, not in preview. For a workload that's mostly app-layer changes against a stable schema, shared-read against dev was the right shape.

## Isolated state, three-layer teardown

Every review app had its own terraform statefile, addressed by MR number. Not a shared statefile with a namespace, not a module inside a bigger state - its own file, isolated, destroyable in one command without touching anything else.

That isolation made teardown a non-event. If an env got stuck or corrupted, `terraform destroy` against its statefile blew it away cleanly. You couldn't accidentally nuke a sibling env because the statefile didn't know about any siblings.

Teardown ran in three layers:

**Layer 1 - MR-close trigger.** When an MR merged, closed, or was deleted, a CI job ran `terraform destroy` against its statefile. In the happy path, that was the whole story: MR closes, environment disappears inside a minute.

**Layer 2 - the 10-day cleanup cron.** CI jobs don't always run cleanly. A runner dies mid-destroy. A transient GCP API error bails the job. A cron swept every ten days, found statefiles for closed MRs with live resources, and ran destroy against each. Most weeks it picked up nothing. Some weeks it caught two or three orphans.

**Layer 3 - manual escape hatch.** Because statefiles were addressable by MR number, an engineer could `terraform destroy` by hand against any MR's backend config. Break-glass for the rare case where both the trigger and the cron missed something.

Most writeups stop at Layer 1. Layer 1 alone is fine until a runner dies at the wrong moment, and then you've got an environment nothing will clean up except a human who remembers it exists. Two and three are the difference between a pattern that works and one that accumulates orphans.

Per-MR review apps on Cloud Run, shared-read against dev Cloud SQL, isolated terraform state per MR, three-layer teardown. Reviewers got real infrastructure to click on, orphans stayed rare, cost envelope stayed sane.
