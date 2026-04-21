---
title: "When Terraform Meets Reality: The Manually-Created Resource Problem"
date: "2026-04-19"
description: "A war story about Terraform state disagreeing with the AWS console — the import attempt that didn't resolve, the allow-failure interim, and why filtering manually-managed resources out of CI was the right call."
tags: ["terraform", "terragrunt", "aws", "devops", "iac", "war-stories"]
---

# When Terraform Meets Reality: The Manually-Created Resource Problem

A merge request landed clean. Tests green, plan reviewed, approvals in. The pipeline moved through build and plan, then hit the infra-apply stage and turned red. Terragrunt was staring at a resource that existed in AWS but didn't exist in its state file — and was refusing to proceed until somebody told it what reality was supposed to look like.

The resource had been created by hand in the console weeks earlier to unblock a different piece of work. At the time it wasn't urgent to bring into Terraform; the path of least resistance was to tag it, move on, and come back. This was coming back. The issue was that the resource had since tangled itself into a piece of infrastructure that lived in a different repo, owned by a different slice of the system. Terraform wanted to either own it completely or know nothing about it, and "partially own a resource that's entangled with something outside your stack" isn't a mode Terraform has.

What follows is the ~24 hours from pipeline-red to clean-landing, the import attempt that didn't resolve, the interim `allow_failure` duct tape, and why the eventual fix was to take the manually-managed module out of CI entirely.

## The import attempt

The textbook answer is `terraform import`. You have a resource in the world and a resource in code — `import` tells Terraform that one corresponds to the other, and subsequent plans should stop treating it as drift.

I wrote the resource definition, ran the import, confirmed the state file now knew about it. Next plan: clean. So far so good.

Except the resource was bound to a sibling resource that lived in a different stack, managed by a different module in a different repo. The binding had been done by hand. Once Terraform owned the resource, every plan started asserting its view of what the binding should look like — which didn't match what the out-of-stack module was trying to assert on its next plan. Each plan wanted to drift the resource back toward its own config, and the other stack's next plan wanted to drift it the other direction. A perpetual reconcile fight, with the resource oscillating between two views of reality on alternating deploys.

This is the subtle failure mode with `import`. The command succeeded. The state was technically correct. But "correct state" is not the same as "a stable plan," and a plan that will never converge is worse than no import at all — because now every future apply has a live dependency on a resource that disagrees with its neighbors.

The options from there were: extend Terraform's ownership to cover the entangled sibling (touches a module outside my scope), rewrite both modules to share a contract (days of work, cross-team), or stop trying to manage the resource in Terraform at all. The first two were worth doing eventually. None of them were worth doing at 4pm with a pipeline red and a merge window closing.

## The pragmatic interim

I flipped `allow_failure: true` on the infra-apply job and merged.

```yaml
deploy:infrastructure:
  stage: infra-apply
  needs: [ plan:infrastructure ]
  allow_failure: true # TODO: Remove this once we have a way to test the infrastructure
```

This is the kind of change that deserves a wince. `allow_failure: true` is a small lie to the pipeline: it says "this job can fail without failing the pipeline," which means downstream stages and merges proceed as if the deploy succeeded. For an infra-apply job that's a big hammer — you're turning off the primary signal that your infrastructure is in the shape you think it is.

The justification was narrow and temporary. The apply was failing on one resource. Every other resource in the stack was fine. Blocking every future merge on an entangled corner case of the state file wasn't a serviceable posture for the rest of the team, and rolling back the import would've left the original drift unresolved. `allow_failure` bought the right to ship the rest of the week's work while I figured out the real fix.

The TODO comment was there for a reason. A flag like this without an expiry note is how codebases end up with six-month-old "temporary" workarounds that nobody remembers the context for.

## The resolution

The right fix, once I stopped trying to win the import fight, was to take the module out of the CI apply path entirely.

Terragrunt's `run --all` has a `--filter` flag that accepts a negation pattern. The pipeline's apply command went from this —

```bash
terragrunt run --all apply
```

— to this:

```bash
terragrunt run --all apply --filter '!internal-launcher-lambda'
```

The `!` inverts the match. Everything in the repo applies except the one module whose resource was fighting with an out-of-stack dependency. That module still gets planned locally when someone's working on it — it just doesn't run in the automated deploy, where a failure would block every other stack's apply.

The same commit flipped `allow_failure` back to `false`:

```yaml
deploy:infrastructure:
  stage: infra-apply
  needs: [ plan:infrastructure ]
  allow_failure: false
```

That's the clean landing. The pipeline is once again telling the truth: if the infra-apply job fails, something is broken and deploys are blocked. The filtered module is explicitly out of scope for CI, with a comment in the pipeline config explaining why, and a README entry pointing at the cross-stack entanglement that would need to be untangled to bring it back in.

The whole incident, import attempt through clean landing, was about 24 hours. Less time than a typical code review cycle.

## Takeaways

**State is an aspiration, not a guarantee.** Terraform assumes it owns what it knows about, and it assumes what it doesn't know about doesn't exist. The world doesn't cooperate. Every real AWS account has console-clicks buried in its history, and every one of those clicks is a potential fight between state and reality. The skill isn't avoiding them — it's recognizing one early and deciding whether the fight is worth fighting.

**Prefer exclusion to a fight when the cost-benefit favors it.** An import that doesn't cleanly land is a tax on every future plan, not a one-time cost. The engineering instinct is to get the tool to do the right thing, and that instinct is usually correct. It is not always correct. When the integration surface is messy and crossing stack boundaries, scoping the tool's responsibility down is often cheaper than forcing it to be right about everything.

**Document and gate the manually-managed resources.** A `--filter` line in CI without a comment or a README pointer becomes a mystery in six months. Future-me opening the pipeline config and seeing `--filter '!internal-launcher-lambda'` with no context is going to assume it's safe to remove — and then find out the hard way. The filter line had a comment. The README had a paragraph. The resource itself had a tag that said "managed manually, see README." Three places, because one place is a place someone won't look.

None of this is glamorous. It's the unsexy middle ground between "infrastructure as code" as a slogan and the reality of a multi-repo AWS account that has history. The tooling does 90% of the job. The remaining 10% is judgment about when to stop fighting the tool and carve out explicit exceptions — documented, narrow, and gated — so that the 90% keeps working.
