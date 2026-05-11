---
title: "If You Do It Twice, Script It"
date: "2026-05-11"
description: "A two-line rule for shell automation — twice means a function, three times means a library — with the two scripts I actually use to live by it: an AWS SSO helper and a logger.sh that lands in every repo I create."
tags: ["shell", "scripts", "automation", "devops", "workflow", "aws"]
---

# If You Do It Twice, Script It

The rule I keep going back to: if you do it twice, script it. If you do it three times, library it.

Twice means it's not a one-off. Three times means other repos (or other people) are going to need it. The threshold isn't about saving keystrokes — it's about consistency. The third time you write the same logic from scratch is the time you write a different version of it by accident.

Most "developer productivity" advice gets the threshold wrong in both directions. Some people script everything, end up with a 600-line `.zshrc` of one-liners they've forgotten the syntax of. Others script nothing, end up doing the same five-step ritual every morning for two years. Both are friction; one is harder to notice.

## Once is fine

If I'm SSHing into a box to grep one log file because someone asked, I don't write a script. I do the thing. The threshold isn't "have I ever done this," it's "is this going to come back."

Three flavors of "once is fine":

- **Truly one-off** — an investigation, a debug session, a "what's in this file" lookup.
- **Done once per machine** — an install step, a network config. The dotfiles handle this; a shell function doesn't help.
- **Discoverable from history** — if `Ctrl-R` finds it in five seconds, it doesn't need a name yet.

The cost of scripting too early is real. A function with one user (me, that one time) becomes a function I forget exists and re-invent badly six months later. Worse than not scripting: scripting and then forgetting. Now there are two versions, one wrong.

## Twice means a function

The threshold for a personal shell function is "I caught myself typing this twice and I can tell it's going to come back."

The example: AWS SSO. Logging in with `aws sso login --profile X` works, but the resulting credentials only flow through tools that read the AWS profile config. A subprocess that needs the actual access keys exported in the environment is on its own. Plus `AWS_PROFILE` shadowing the exported credentials means tools sometimes pick the wrong one.

I hit this maybe twice in a week. Wrote a function:

```bash
# AWS SSO login + export credentials into the current shell.
# Defined as a function (not `bash script.sh`) so the exports persist.
sso() {
  local profile="${1:-dev}"
  aws sso login --profile "$profile" || return 1
  eval "$(aws configure export-credentials --profile "$profile" --format env)"
  unset AWS_PROFILE
  echo "Exported credentials for profile: $profile (expires $AWS_CREDENTIAL_EXPIRATION)"
  aws sts get-caller-identity --query 'Arn' --output text
}
```

Six lines of logic. The interesting part is that it's a function, not a script. If `sso` were `bash sso.sh dev`, the exports would land in a child shell and disappear the moment the script returned. A function runs in the current shell and the `eval` lands the env vars where I need them.

That distinction — function vs. script — is the kind of thing you only know after the first attempt at scripting it goes wrong. Lives in `~/.aliases`, sourced by every shell I open. Takes a profile arg with a default, returns a clean error if SSO fails, and prints the caller identity so I can confirm I'm not about to run `terraform apply` against the wrong account.

I have a handful of these. Each is short. Each solves a specific friction I hit at least twice. None of them are clever.

## Three times means a library

The threshold for *promoting* something from a personal function to a reusable library is "I want this in three different places."

The example: shell scripts in CI/CD. Every project I work on ends up with at least one deployment script, one helper script, one bootstrap script. All of them want the same things: colored output, key-value logging, section headers, strict mode, dependency checks. Every project re-invents these badly the first three times.

So `logger.sh` exists. It lives at `scripts/logger.sh` in every repo I create. Anything that needs structured output sources it:

```bash
#!/bin/bash
source "$(dirname "$0")/logger.sh"

set_strict
require_commands aws terraform jq

log_section "Deploying environment: $ENV"
log_kv "Region" "$REGION"
log_kv "Account" "$ACCOUNT_ID"

if ! aws sts get-caller-identity >/dev/null 2>&1; then
  error_exit "Not authenticated. Run 'sso' first."
fi

log_info "Running terraform plan..."
terraform plan -out=tfplan
log_success "Plan complete"
```

The library itself is small:

```bash
# scripts/logger.sh

export RED='\033[31m'
export GREEN='\033[32m'
export YELLOW='\033[33m'
export BLUE='\033[34m'
export CYAN='\033[36m'
export BOLD='\033[1m'
export CLEAR='\033[0m'

log_info()    { echo -e "${BLUE}$*${CLEAR}"; }
log_success() { echo -e "${GREEN}$*${CLEAR}"; }
log_warning() { echo -e "${YELLOW}$*${CLEAR}"; }
log_error()   { echo -e "${RED}$*${CLEAR}"; }

log_section() {
  echo -e "${CYAN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${CLEAR}"
  echo -e "${CYAN}${BOLD}  $*${CLEAR}"
  echo -e "${CYAN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${CLEAR}"
}

log_kv() {
  local key="$1" value="$2"
  printf "${BLUE}%-30s${CLEAR} %s\n" "${key}:" "${value}"
}

error_exit() {
  log_error "$1"
  exit "${2:-1}"
}

command_exists() { command -v "$1" >/dev/null 2>&1; }

set_strict() { set -euo pipefail; }

require_commands() {
  local missing=""
  for cmd in "$@"; do
    command_exists "$cmd" || missing="${missing}${missing:+ }$cmd"
  done
  [ -n "$missing" ] && error_exit "Missing required commands: ${missing}"
}
```

That's the whole API. Nothing fancy. The point isn't the cleverness — the point is that every deployment script across every repo I touch uses the same `log_kv` and the same `set_strict` and the same `require_commands`. Failure modes are predictable. Output formatting is consistent. When something breaks, the line that says `Missing required commands: terraform` looks the same everywhere.

The other reason this matters: it works in CI/CD. The same logger that gives me colored output locally writes the same structured lines into a pipeline log. No re-implementation, no "this works on my machine but the pipeline output is unreadable." A library that lives in the repo is the only kind that survives the jump from interactive to automated.

Could I make `logger.sh` a published package? Sure. Would the act of publishing it make it better? No — it'd add a dependency, a versioning concern, and an install step to a fifty-line file that gets copied verbatim. The "library" doesn't have to be public to be a library. It just has to be the same code, used the same way, in more than one place.

## What you give up by waiting

The cost of the threshold rule is friction you tolerate before you cross it. The first time you do something is friction; the second time is annoying friction; the third time, you've already paid the cost three times and you still have to write the library. It feels backward — by the time you script it, you've already taken the pain.

But the alternative is worse. Scripting on the first instance gives you a library full of stuff that turned out to be one-off. You forget half of it. The other half does the wrong thing slightly because the second use case wasn't anticipated.

Better to write it after the patterns have stabilized. Write it once, in the shape the actual use cases asked for.

---

Twice, function. Three times, library.

Everything else is just typing.
