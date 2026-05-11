---
title: "Terraform Apply - When an Engineer Creates Resources in the Console"
date: "2026-04-17"
description: "An apply went red because somebody had clicked resources into existence weeks earlier and an AI-generated PR tried to claim them. The fix wasn't glamorous — filter the bad module, delete the manual resources in pre-prod, let terraform create them fresh."
tags: ["terraform", "terragrunt", "aws", "devops", "iac", "war-stories"]
---

# Terraform Apply - When an Engineer Creates Resources in the Console

A merge landed clean - tests green, plan reviewed, approvals in. The pipeline ran build, ran plan, hit the apply stage and went red. Terragrunt was trying to claim resources that already existed in the account, under the same names, and refusing to move until somebody told it what reality was supposed to look like.

Here's how it got there. A lambda and a couple supporting resources had been clicked into existence in the console weeks earlier to unblock a different piece of work - the kind of thing you tag, mentally promise to come back to, and forget about (yet). Somebody finally tried to come back. They pointed an AI assistant at what was running in the account, asked it to generate terraform, merged what came back. The AI went further than the world had. It generated overlapping blocks with the same names and ARNs as the manual ones, plus a handful of extras the team didn't actually need. CI ran the apply, hit the name collisions, dropped the rest of the stack's deploy with it.

## "Just import them"

Textbook answer is `terraform import`. Resource exists in the world, block exists in code, `import` ties them together, drift resolved.

That assumes the code was carefully written to match the world. This code wasn't. The AI hadn't generated one block per existing resource - it'd generated more blocks than existed, some overlapping the manual ones, some not corresponding to anything. `import` doesn't fix that. It binds one existing thing to one block. It doesn't tell you which of eight blocks should bind to your four real resources, or what to do with the four blocks that shouldn't exist at all.

The real fix was: read the generated code, compare it block-by-block against the account, delete the blocks that were hallucinated, normalize the ones that overlapped, and *then* import the legitimate ones. Hours of careful work against a moving account. Somewhere in the middle a plan would be valid. Before that, every apply would fail the same way.

Not happening at 4pm on a day with a merge window closing.

## The unblock

First move was to stop blocking everyone else. Until the config got untangled, the rest of the stack still had to deploy.

Terragrunt's `run --all` has a `--filter` flag - basically a glob with `!` negation. So the pipeline went from this:

```bash
terragrunt run --all apply --non-interactive
```

to this:

```bash
terragrunt run --all apply --filter '!launcher-lambda' --non-interactive
```

Everything in the repo applied except the one bad module. That module still planned locally when somebody worked on it - it just didn't run in CI, where a failure was blocking every other stack's deploy.

What I cared about was that the pipeline kept telling the truth. If the infra-apply job failed, something was actually broken and deploys were actually blocked. The filtered module was explicitly out of scope for CI - comment in the pipeline config saying why, README pointer at the work that had to happen before the filter could come out. A `--filter '!something'` line with no context six months from now reads as "safe to remove" to whoever finds it next, and they find out the hard way.

## Cleanup

The lucky part - the lambda was new. Pre-prod, no live traffic. So the cleanup was the simplest possible version of itself: open the console, find every resource the AI's terraform was trying to claim, delete them. No rollback plan, no blast radius, no maintenance window. The kind of thing you do during normal hours, with coffee.

Once the conflicting resources were gone, the filter came out:

```bash
terragrunt run --all apply --non-interactive
```

Apply ran clean. Terraform created the lambda and its dependencies from scratch and actually owned them. State matched the world, world matched the config.

Done.

---

None of this was glamorous. Most apply failures aren't. They're console clicks somebody made months ago, plus a PR that didn't catch them, plus a pipeline that needs to ship something else this afternoon. Skill isn't avoiding them. It's spotting the disagreement early, picking your move - import, delete, or filter - and writing enough context around whichever you pick that the next person doesn't undo it accidentally.
