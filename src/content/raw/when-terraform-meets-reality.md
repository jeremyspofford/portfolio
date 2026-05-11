---
title: "When Terraform Meets Reality: The Manually-Created Resource Problem"
date: "2026-04-17"
description: "A war story about Terraform state disagreeing with the AWS console — the import attempt that didn't fit, the temporary filter that kept deploys moving, and the pre-prod cleanup that finally let Terraform own the lambda."
tags: ["terraform", "terragrunt", "aws", "devops", "iac", "war-stories"]
---

# When Terraform Meets Reality: The Manually-Created Resource Problem

A merge request landed clean. Tests green, plan reviewed, approvals in. The pipeline moved through build and plan, then hit the infra-apply stage and turned red. Terragrunt was trying to apply a module whose config declared resources that already existed in AWS under the same names — and refusing to proceed until somebody told it what reality was supposed to look like.

The resources had been created by hand in the console weeks earlier to unblock a different piece of work. At the time it wasn't urgent to bring them into Terraform; the path of least resistance was to tag them, move on, and come back. Someone tried to come back. They pointed an AI assistant at what was running in the account, asked it to generate Terraform, and merged what it produced. The output went further than the world actually had — new resource blocks that overlapped with the existing manual ones (same names, same ARNs the apply would try to claim) plus a handful of extras the team didn't need. When CI ran the apply, it failed loudly on the name collisions, and took the rest of the stack's deploy job with it.

What follows is how the pipeline went from red to clean — the import attempt that never got to run cleanly, the temporary filter that bought everyone else time, and the pre-prod cleanup that finally let Terraform own the lambda.

## The import attempt

The textbook answer is `terraform import`. You have a resource in the world and a resource in code — `import` tells Terraform that one corresponds to the other, and subsequent plans should stop treating it as drift.

That textbook assumes the code was written to match what's actually running in the account. This config didn't clear that bar. The AI-generated blocks weren't a careful one-to-one with the manual resources; they were a superset the world didn't have, sharing names and ARNs with things that did exist. `import` is a precision tool — it binds one existing resource to one config block. It doesn't resolve a situation where the config declares eight resources and the world has four of them, three already-there-under-manual-management and five that shouldn't exist at all.

The real work was more involved: read the generated code carefully, compare it block-by-block against what's actually running in the account, delete the blocks that were hallucinated or unnecessary, normalize the ones that overlapped with manual resources, and only then run `import` against the legitimately existing resources. That's hours of careful attention against a moving account. Somewhere in the middle of that work, a plan would be viable. Before that, every apply would fail the same way.

The options from there were: prune and reconcile the config carefully and import the legitimate resources one by one (hours of work, high risk of overlooking something), delete the manual resources from AWS and let Terraform create them fresh (less daunting than it sounds since this was a new feature without live traffic), or stop trying to run the module in CI at all while the config got sorted out. The first two were the real fixes. Neither was worth doing at 4pm with a pipeline red and a merge window closing.

## The unblock

The first move was to stop blocking everyone else. Until the config could be untangled, the pipeline had to keep deploying the rest of the stack.

Terragrunt's `run --all` has a `--filter` flag that accepts a glob pattern, with `!` as a negation prefix. The pipeline's apply command went from this —

```bash
terragrunt run --all apply
```

— to this:

```bash
terragrunt run --all apply --filter '!simulator-launch-lambda' --non-interactive
```

The `!` inverts the match; `--non-interactive` keeps the apply from blocking on confirmation prompts in CI. Everything in the repo applied except the one module whose config was in bad shape. That module still got planned locally when someone was working on it — it just didn't run in the automated deploy, where a failure would have blocked every other stack's apply.

The pipeline kept telling the truth: if the infra-apply job failed, something was broken and deploys were blocked. The filtered module was explicitly out of scope for CI, with a comment in the pipeline config explaining why, and a README entry pointing at the work that needed to happen before the filter could come out.

## The cleanup

The lucky part was that the lambda was a new feature that hadn't gone to prod yet. That made the cleanup straightforward: walk through the AWS account, find every manually-created resource the AI-generated config was trying to claim, and delete it. No live traffic, no blast radius, no rollback plan to write — the kind of cleanup you can do during normal hours.

Once the conflicting resources were gone, the `--filter` came out of the pipeline:

```bash
terragrunt run --all apply --non-interactive
```

The next apply ran cleanly. Terraform created the lambda and its associated resources from scratch and actually owned them. The state file matched the world, the world matched the config, and the war story closed.

## Takeaways

**State is an aspiration, not a guarantee.** Terraform assumes it owns what it knows about, and it assumes what it doesn't know about doesn't exist. The world doesn't cooperate. Every real AWS account has console-clicks buried in its history, and every one of those clicks is a potential fight between state and reality. The skill isn't avoiding them — it's recognizing one early and deciding whether to import, delete, or filter.

**When the tool and the world disagree, fix the world if you can.** An import that doesn't cleanly land is a tax on every future plan, not a one-time cost. If the resources in question aren't load-bearing yet — pre-prod, no live traffic — deleting them and letting Terraform create them fresh is faster than a careful import and leaves you with a state file that actually reflects what's running.

**A narrow, documented exclusion is the right interim.** A `--filter` line buys time for the rest of the team without lying about whether the deploy succeeded. The discipline is keeping it narrow and time-bounded — a comment in the pipeline config, a README entry, a clear definition of what would let it come out — so it doesn't quietly become permanent. A `--filter '!simulator-launch-lambda'` with no context six months later reads as "safe to remove" to whoever finds it next, and they find out the hard way.

None of this is glamorous. It's the unsexy middle ground between "infrastructure as code" as a slogan and the reality of an AWS account that has history. The tooling does 90% of the job. The remaining 10% is judgment — when to import, when to bring the world in line with the code, and when to carve out a narrow, documented exception while you decide which of those to do.
