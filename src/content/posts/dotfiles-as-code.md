---
title: "Dotfiles as Code"
date: "2026-05-11"
description: "Stow-managed dotfiles with a three-layer shell config, conditional gitconfig for multi-identity work, and machine-specific overrides that never get committed. The patterns that make a fresh machine feel like home in fifteen minutes."
tags: ["dotfiles", "shell", "stow", "git", "devops", "workflow"]
---

# Dotfiles as Code

I keep my entire shell environment in a repo. Stow-managed, three-layer shell config, conditional gitconfig per workspace, machine-specific overrides that never get committed. The principle is simple: treat your environment as code.

That means version control, reproducibility, idempotent setup, dry-run before apply. Everything you'd want from infrastructure, applied to the thing you spend the most time in.

## Why stow

The dotfiles management space is crowded. chezmoi, yadm, rcm, dotbot, raw git in `$HOME`, hand-rolled symlink scripts. I've tried a few. I keep coming back to stow.

The reason is one specific property: stow uses real symlinks, so editing the source updates the live config immediately.

That's it. No re-apply step. No template rendering. No `chezmoi apply` after every change. Open `packages/shell/.aliases`, save, the change is live everywhere — because `~/.aliases` is a symlink pointing at the file you just edited.

The alternative tools each solve a real problem (templating, encryption, per-host variants), but they all impose a layer between "I changed a thing" and "the change is active." Stow doesn't. The cost is that templating gets done by the shell itself — platform detection at sourcing time, not at apply time — which is a tradeoff I'm fine making.

The other thing I like: stow is one command, doesn't have its own config language, and the failure modes are easy to reason about. If `~/.zshrc` is a symlink to my repo file, the system works. If it's a regular file, something has gone wrong and `ls -la ~/.zshrc` tells me what.

## Packages as semantic boundaries

Stow's mental model is packages — directories under `packages/` that mirror the structure of `$HOME`. Each package owns one concern.

```bash
packages/
├── claude/      # ~/.claude/* — global Claude Code config
├── cursor/      # Cursor IDE rules
├── git/         # ~/.gitconfig, ~/.gitignore_global
├── mise/        # ~/.config/mise/ — global tool versions
├── nvim/        # ~/.config/nvim/ — neovim config
├── scripts/     # ~/bin/* — personal scripts
├── shell/       # ~/.bashrc, ~/.zshrc, ~/.commonrc, ~/.aliases
└── ssh/         # ~/.ssh/config (multi-account)
```

Adding a new tool is adding a directory:

```bash
mkdir -p packages/tmux
mv ~/.tmux.conf packages/tmux/.tmux.conf
stow tmux
```

Done. Tmux config is now version-controlled, symlinked into `$HOME`, and stowed on every fresh machine going forward.

What I like about the decomposition is what gets enforced by structure. Each tool has one home. You don't have an `.aliases` file that's secretly importing zsh-only syntax because it lived next to your `.zshrc` for a while. The shell package owns shell concerns; the git package owns git concerns. If a thing in `.aliases` is git-specific enough to warrant it, it moves.

I also stow packages independently. On a server I'd want `shell`, `git`, `mise`, and `ssh` but not `nvim` or `claude`. `stow shell git mise ssh` and that's the install. The package boundary is the deployment boundary.

## The shell config in three layers

The shell package has more pieces than the others because shell config has more responsibilities. Splitting them:

- `.commonrc` — anything that runs in both bash and zsh: PATH, environment variables, platform detection, tool activation. **No shell-specific syntax allowed.** This is the file that does the most work.
- `.bashrc` / `.zshrc` — shell-specific stuff. Prompt, completion, keybindings, history settings. Both source `.commonrc` first.
- `.aliases` — sourced by `.commonrc`. One place for git, docker, k8s, terraform shortcuts.

The layering means I can switch between bash and zsh on different machines without forking config. WSL on one machine runs zsh, a server runs bash, both source the same `.commonrc` and behave the same in every way that matters.

`.commonrc` is where the platform-aware stuff lives:

```bash
case "$(uname -s)" in
  Darwin) PLATFORM="macos" ;;
  Linux)
    if grep -qi microsoft /proc/version 2>/dev/null; then
      PLATFORM="wsl"
    else
      PLATFORM="linux"
    fi
    ;;
  *) PLATFORM="unknown" ;;
esac
export PLATFORM
```

`$PLATFORM` then gets used downstream for things that have to fork by host type. The 1Password SSH agent socket lives in a different place on macOS vs Linux vs WSL:

```bash
case "$PLATFORM" in
  wsl)
    export GIT_SSH_COMMAND="ssh.exe"
    ;;
  macos)
    _sock="$HOME/Library/Group Containers/2BUA8C4S2C.com.1password/t/agent.sock"
    [ -S "$_sock" ] && export SSH_AUTH_SOCK="$_sock"
    ;;
  linux)
    [ -S "$HOME/.1password/agent.sock" ] && export SSH_AUTH_SOCK="$HOME/.1password/agent.sock"
    ;;
esac
```

WSL is its own case because Windows handles the agent natively — git shells out to `ssh.exe` and 1Password's Windows app handles the rest. macOS has the socket in a specific bundle path. Linux uses the standard agent location.

The point isn't the specific paths. The point is platform detection at source time, branching in shell, one repo across three OSes.

## Multi-identity through conditional includes

This is the pattern that took me longest to find and that I'd never want to live without now.

The problem: I have a personal GitHub identity, an Aria Labs identity, and a couple of work identities. Every commit needs to be attributed correctly. The wrong email in the wrong repo is a stupid kind of mistake that's hard to notice and embarrassing to fix.

The solution is in git's own config:

```ini
[user]
    name = Jeremy Spofford
    email = 23528024+jeremyspofford@users.noreply.github.com

[includeIf "gitdir:~/workspace/arialabs/"]
    path = ~/.gitconfig-arialabs
```

The top section is my default. The `includeIf` pulls in a second config file *only when the git directory is under* `~/workspace/arialabs/`. That second file overrides `[user]`:

```ini
[user]
    name = Nova
    email = nova@arialabs.ai
```

I have several of these — one per work context, each pointing at its own `.gitconfig-<context>` file. The same shell trick handles SSH (per-host aliases in `~/.ssh/config` so `git@github.com-arialabs:` uses a different identity than `git@github.com:`), and the same shell trick handles cloning (a `clone-aria` alias that wraps the host-aliased clone).

The whole setup is decided by *where the repo is cloned*. Drop a repo in `~/workspace/arialabs/`, it's an Aria Labs commit. Drop it in `~/workspace/`, it's personal. Zero decision per commit. Zero configuration per repo. Zero chance of a wrong-email leak because there's no per-repo override to forget.

## What never goes in the repo

Some things shouldn't be version-controlled and shouldn't be committed by accident. The pattern I use for those:

- `~/.secrets` — API keys, tokens. Sourced by `.commonrc` if it exists. Listed in `.gitignore_global`. Never lives in the repo.
- `~/.commonrc.local` — machine-specific overrides. Sourced *last* by `.commonrc`, so it can override anything earlier. Extra PATH entries, optional tools, GPU-specific env vars on the GPU machine.
- `~/.aliases.local` — extra aliases per machine. Same pattern.

The repo has an `examples/` directory with commented starter files. On a fresh machine: `cp examples/commonrc.local.example ~/.commonrc.local`, edit, done. The example is the doc.

What this pattern protects against: the moment you're tempted to put "just one secret" into the repo because "it's a private repo anyway." Private today, public tomorrow when you decide to share your dotfiles. Or someone gets repo access. Or a CI job leaks the file. Secrets stay out of the repo, full stop. Local overrides stay out of the repo, full stop. The split is per-machine state vs. cross-machine convention — and only the convention gets committed.

## The idempotent install

A fresh machine should go from clean install to fully-configured environment with one command. Mine does:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/jeremyspofford/dotfiles/main/bootstrap.sh)
```

That's it. Installs prerequisites, clones the repo, runs `install.sh`, which installs system packages (stow, zsh, neovim, delta, shellcheck), installs mise, runs `mise install` for every tool in the global `config.toml`, then iterates over every directory in `packages/` and stows it.

The interesting piece is conflict handling. A fresh machine has its own `.bashrc`, its own `.gitconfig`. Stow won't link over an existing file — by design. The wrapper handles it:

- If a target already points at our repo, skip.
- If it's a foreign symlink (oh-my-zsh, older dotfiles tool), remove.
- If it's a regular file, move it to `~/.dotfiles_backup/` preserving structure.

```bash
if [ -L "$target" ]; then
  rm "$target"
elif [ -f "$target" ]; then
  mkdir -p "$(dirname "$backup_path")"
  mv "$target" "$backup_path"
fi
```

Then stow runs. The user gets warned at the top of the script that this is going to happen, but nothing gets clobbered. The backup directory survives across runs, so even if you fat-finger something twice, the originals are still there.

Dry-run support matters as much as the apply. `./stow.sh -n` shows you what would happen without changing anything. I run it before every install on a machine I care about. Same reflex as `terraform plan` before `terraform apply` — the parallel is exact.

---

What I want from this repo eventually is for anyone to use it. The shape is portable already — package boundaries, three-layer shell config, conditional includes for multi-identity work, local overrides for everything per-machine.

The one thing I'd push hard on if you're starting your own version: use stow before reaching for chezmoi or any templated tool. Stow's simplicity is what makes the whole pattern hold up. The moment a tool sits between "I changed a thing" and "the change is active," dotfiles drift from code you edit into a system you run.

A clean machine should take fifteen minutes to feel like home. If yours takes longer, the dotfiles are broken.

Treat them like code.
