---
title: "When Terraform Meets Reality: The Manually-Created Resource Problem"
date: "2026-04-20"
description: "A war story about Terraform state disagreeing with the AWS console — the import attempt that didn't resolve, the allow-failure interim, and why filtering manually-managed resources out of CI was the right call."
tags: ["terraform", "terragrunt", "aws", "devops", "iac", "war-stories"]
---

# When Terraform Meets Reality: The Manually-Created Resource Problem

A merge request landed clean. Tests green, plan reviewed, approvals in. The pipeline moved through build and plan, then hit the infra-apply stage and turned red. Terragrunt was trying to apply a module whose config declared resources that already existed in AWS under the same names — and refusing to proceed until somebody told it what reality was supposed to look like.

The resources had been created by hand in the console weeks earlier to unblock a different piece of work. At the time it wasn't urgent to bring them into Terraform; the path of least resistance was to tag them, move on, and come back. Someone tried to come back. They pointed an AI assistant at what was running in the account, asked it to generate Terraform, and merged what it produced. The output went further than the world actually had — new resource blocks that overlapped with the existing manual ones (same names, same ARNs the apply would try to claim) plus a handful of extras the team didn't need. When CI ran the apply, it failed loudly on the name collisions, and took the rest of the stack's deploy job with it.

What follows is the ~24 hours from pipeline-red to clean-landing, the import attempt that never got to run cleanly, the interim `allow_failure` duct tape, and why the eventual fix was to take the module out of CI entirely while the config gets untangled.

## The import attempt

The textbook answer is `terraform import`. You have a resource in the world and a resource in code — `import` tells Terraform that one corresponds to the other, and subsequent plans should stop treating it as drift.

That textbook assumes the code was written to match what's actually running in the account. This config didn't clear that bar. The AI-generated blocks weren't a careful one-to-one with the manual resources; they were a superset the world didn't have, sharing names and ARNs with things that did exist. `import` is a precision tool — it binds one existing resource to one config block. It doesn't resolve a situation where the config declares eight resources and the world has four of them, three already-there-under-manual-management and five that shouldn't exist at all.

The real work was more involved: read the generated code carefully, compare it block-by-block against what's actually running in the account, delete the blocks that were hallucinated or unnecessary, normalize the ones that overlapped with manual resources, and only then run `import` against the legitimately existing resources. That's hours of careful attention against a moving account. Somewhere in the middle of that work, a plan would be viable. Before that, every apply would fail the same way.

The options from there were: prune and reconcile the config carefully and import the legitimate resources one by one (hours of work, high risk of overlooking something), delete the manual resources from AWS and let Terraform create them fresh (a maintenance window and some coordination), or stop trying to run the module in CI at all while the config got sorted out. The first two were the right long-term moves. Neither was worth doing at 4pm with a pipeline red and a merge window closing.

## The pragmatic interim

I flipped `allow_failure: true` on the infra-apply job and merged.

```yaml
deploy:infrastructure:
  stage: infra-apply
  needs: [ plan:infrastructure ]
  allow_failure: true # TODO: Remove this once we have a way to test the infrastructure
```

This is the kind of change that deserves a wince. `allow_failure: true` is a small lie to the pipeline: it says "this job can fail without failing the pipeline," which means downstream stages and merges proceed as if the deploy succeeded. For an infra-apply job that's a big hammer — you're turning off the primary signal that your infrastructure is in the shape you think it is.

The justification was narrow and temporary. The apply was failing on one module. Every other module in the stack was fine. Blocking every future merge on a broken config for one Lambda wasn't a serviceable posture for the rest of the team, and reverting the commit that added the module to Terraform would've put us back to manually-created resources that the state file didn't know about. `allow_failure` bought the right to ship the rest of the week's work while I figured out the real fix.

The TODO comment was there for a reason. A flag like this without an expiry note is how codebases end up with six-month-old "temporary" workarounds that nobody remembers the context for.

## The resolution

The right fix, once I stopped trying to win the import fight, was to take the module out of the CI apply path entirely.

Terragrunt's `run --all` has a `--filter` flag that accepts a glob pattern, with `!` as a negation prefix. The pipeline's apply command went from this —

```bash
terragrunt run --all apply
```

— to this:

```bash
terragrunt run --all --filter '!./internal-launcher-lambda' -- apply
```

The `!` inverts the match; the leading `./` is the path prefix the glob expects; `--` separates the Terragrunt flags from the Terraform subcommand. Everything in the repo applies except the one module whose config was in bad shape after the earlier generation attempt. That module still gets planned locally when someone's working on it — it just doesn't run in the automated deploy, where a failure would block every other stack's apply.

The same commit flipped `allow_failure` back to `false`:

```yaml
deploy:infrastructure:
  stage: infra-apply
  needs: [ plan:infrastructure ]
  allow_failure: false
```

That's the clean landing. The pipeline is once again telling the truth: if the infra-apply job fails, something is broken and deploys are blocked. The filtered module is explicitly out of scope for CI, with a comment in the pipeline config explaining why, and a README entry pointing at the AI-generated config that needs to be pruned and cleanly imported before the module can come back.

Less time, in the end, than a typical code review cycle.

## Takeaways

**State is an aspiration, not a guarantee.** Terraform assumes it owns what it knows about, and it assumes what it doesn't know about doesn't exist. The world doesn't cooperate. Every real AWS account has console-clicks buried in its history, and every one of those clicks is a potential fight between state and reality. The skill isn't avoiding them — it's recognizing one early and deciding whether the fight is worth fighting.

**Prefer exclusion to a fight when the cost-benefit favors it.** An import that doesn't cleanly land is a tax on every future plan, not a one-time cost. When the cost of making the tool agree with reality exceeds the cost of exclusion, exclusion wins.

**Document and gate the manually-managed resources.** A `--filter` line without a comment becomes a mystery in six months — future-me seeing `--filter '!./internal-launcher-lambda'` with no context will assume it's safe to remove, and find out the hard way. The filter line had a comment. The README had a paragraph. The resource had a tag. One place is always the place someone won't look.

None of this is glamorous. It's the unsexy middle ground between "infrastructure as code" as a slogan and the reality of an AWS account that has history. The tooling does 90% of the job. The remaining 10% is judgment about when to stop fighting the tool and carve out explicit exceptions — documented, narrow, and gated — so that the 90% keeps working.

## Postscript

The module is still filtered out of CI at the time of writing. The real fix is in progress: read through the AI-generated config carefully, prune every block that duplicates or hallucinates a resource, normalize the ones that should survive, and import the legitimately-existing resources one at a time. When that converges, the `--filter` line disappears, the lambda is back in the regular apply path, and this becomes a closed war story instead of an open one.
