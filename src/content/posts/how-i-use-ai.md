---
title: "How I Actually Use AI"
date: "2026-05-11"
description: "The setup behind daily AI use that actually compounds — scoped access with its own identity, slash commands as reusable workflows, a memory pipeline that survives session boundaries, and an autonomous agent fleet that runs on every PR."
tags: ["ai", "claude-code", "workflow", "automation", "devops"]
---

# How I Actually Use AI

I can't imagine giving a model free reign to anything that I own.

What I do instead: scope its abilities, scope its permissions, scope what it can touch. AI is a tool. Tools have edges. The job is knowing where the edges are and building the rest yourself.

## Scoped access, not free reign

The lesson I keep returning to: never connect an AI to a service where the worst-case action is something you can't undo.

I once gave one access to my gmail through n8n. The AI could basically do what gmail filtering can do, so it was pretty bad. Not because it broke anything — because the surface area I gave it was wider than the work I needed it to do. That's the trap. You let it in to do one thing and now it can do thirty things.

Now the rule is: dedicated identity, dedicated keys, dedicated machine when it makes sense.

The setup looks like this:

- A Beelink mini-pc, Pop!_OS, always-on. Its own API keys (most free, a couple capped at $10/month). Its own gmail account, its own GitHub org, its own 1Password vault. Tailscale-accessible from my phone.
- A Dell XPS 8950 with a 3060 Ti that gets woken via WoL when it needs to use a local LLM. Sleeps the rest of the time.
- A dedicated Chrome profile signed in as my Aria Labs Workspace identity — quarantined trust zone for any AI-agent browser activity. Brave stays the sole default for banking, healthcare, personal email, real-life browsing.

The trust model is asymmetric on purpose. It has full admin on its own 1Password vault — can create keys, rotate them, delete them. I have access to its vault; it does not have access to mine. Same shape for gmail, GitHub, everything else: it owns its identity, I own mine.

It only knows what I tell it, or what it observes through a terminal session, a code session, a Cursor or Claude session I've explicitly opened. Anything outside of that is off-limits by default, not by enforcement — by absence.

If it breaks, it doesn't break me.

That Chrome profile is the one I'm least comfortable with and the one I think about the most. Letting a browser extension run inside an authenticated session is a real concession. The reason I'm OK with it is the identity is decoupled — the AI sees AI activity, not my personal life. Different trust zone, different rules.

I've also let one AI run pretty far on its own in a contained environment. It generated 38 repos that it "brainstormed" and built a few PoCs for me to check out. Cool but scary. A couple of those are now real projects. Most are graveyard. The lesson there was less about output quality and more about volume — once you remove the friction of "I have to type this myself," you discover how much of your time was the typing, and how much was the deciding.

## Slash commands instead of fresh prompts

The biggest daily-use unlock is not asking AI fresh every time. It's building reusable workflows and invoking them.

I have over 40 custom skills under `~/.claude/skills/` and 20+ custom slash commands. The commands aren't fancy — most are a one-line stub that points to a longer skill file. The skill file is the real instruction set.

A few from the cert study workflow I built:

- `/lecture-note <transcript>` — generates a complete vault note from a Udemy lecture transcript. Pulls structure from a template, writes 8–15 spaced-repetition cards in the Obsidian SR plugin's tag format, updates the cert's index page, flags weak spots.
- `/quiz-me <note|topic|folder>` — Socratic active-recall quiz, 10 questions default. No info-dump, no softening — wrong answers get called wrong. A "Learning" output style enforces the discipline.
- `/weak-spots-drill [cert]` — high-pressure focused drill on just the weak spots that show up in my running tracker. 15 questions, no warm-up.
- `/exam-eve [cert]` — calm 3-phase pre-exam refresh: confidence reps, quick-touch on active gaps, strategy reminders. Different output style than the drill. Night-before, the last thing I need is high-pressure quizzing.

Then for the job hunt:

- `/apply-to-job [clipping | URL]` — takes a job posting, generates a requirements crosswalk against my career entity (skills inventory + Notable Accomplishments), produces STAR stories pre-mapped to specific requirements, tiered interviewer questions, talking points. Won't overwrite an existing application page. Won't re-ingest a clipping that's already processed. Writes to a predictable path with bidirectional backlinks so the source and the application page can find each other.
- `/cover-letter <slug>` — operationalizes Laszlo Bock's 4-paragraph framework. Paragraphs 1–2 are a fixed base template; paragraph 3 anchors to the application page's "Strong (signature)" crosswalk row. Single source of truth for the unicorn hook — if the signature changes, the cover letter regenerates correctly.

The pattern across all of these: workflow over prompt. The work is in writing the skill once — every constraint, every edge case, every "don't do X." After that, the daily use is just `/quiz-me` and the constraints come with it for free.

The cost is upfront design time. The payoff is the model doesn't get to drift. It does the thing the same way every time.

## Memory that actually persists

The thing that broke me out of "AI conversations are disposable" was building a memory pipeline that survives session boundaries.

Two files load at the start of every session:

- `USER.md` — who I am. Role, family, work context, preferences, opinions, things to remember. Stable, low-churn.
- `MEMORY.md` — long-term context. Active projects, target roles, ongoing decisions, recent corrections. Higher churn.

These are read silently at session start. The session doesn't ask me to re-explain that I'm a senior DevOps engineer targeting platform roles, that I prefer batched updates, that I'm pre-CKA and AWS depth is the gap. It already knows.

When something worth keeping comes up during a session, I don't write a markdown file by hand. There's an MCP tool — `append_to_daily_log` — that writes to `Assistant/memory/YYYY-MM-DD.md` atomically under a file lock. The lock matters because I'm often running multiple Claude Code sessions in parallel and they all want to write to the same daily log. Direct writes would race; the MCP serializes them.

Each entry is small. 1–5 bullets, a one-line `session_context`, a `source_tool` tag (so I can tell which session wrote it — and tell which entries came from Cursor, which doesn't have a SessionEnd hook and therefore writes nothing. Yes, I tested this).

## Auto-ingest as a background job

When I'm working in a code repo, anything worth preserving gets dropped as a "passive capture" — a rough note at `$WIKI_VAULT/raw/[domain]/[project]/YYYY-MM-DD-session.md`. Frontmatter says `ingested: false`. The note can be sloppy; it's not the final form.

A hook (`auto-ingest.sh`) runs on SessionStart, PostCompact, and SubagentStop. It checks for any markdown files with `ingested: false`, acquires a lockfile, then spawns a background Claude session with `--dangerously-skip-permissions` and `--print` to process the raw notes per the wiki's ingest rules. The hook exits in milliseconds. The actual ingest runs detached.

```bash
PENDING=$(grep -rl "^ingested: false" "$WIKI_VAULT/raw/" --include="*.md" 2>/dev/null | wc -l | tr -d ' ')
[ "$PENDING" -eq 0 ] && exit 0
```

The ingest moves raw files to `archive/`, flips the `ingested` flag, updates the relevant wiki page(s), and maintains bidirectional links between source notes and curated pages. It's an autonomous AI workflow that processes notes while I sleep....most of the time. Sometimes the daily-log-sweep cron picks up notes the hook missed.

This is the part most "how to use AI" guides miss. The value isn't in any single AI conversation. The value is in the system that captures what mattered from each conversation and makes it findable later.

## Where I trust it autonomously

The portfolio repo has a `.claude/agents/` directory with seven autonomous review agents — security audit, performance review, architecture review, API quality, frontend quality, test coverage, dependency health. They run on every PR via GitHub Actions. They open issues tagged `agent-fleet` when they find things.

I trust them more than I trust an interactive session for the same work. Not because they're smarter — they're not — but because the contract is constrained:

- They can only read the repo.
- They can only post comments and open issues.
- They run on every PR, not on demand.
- Output is reviewed before any action is taken.

The dependency-health agent has the most authority — it can auto-merge safe patch and minor bumps if tests pass. Everything else is read-only or comment-only. The blast radius of "this agent did something dumb" is "I close an issue."

The reason this works is that the rest of the system is pre-built. The skill files tell the agents what to look for. CI gives them a sandbox. The PR review is the human checkpoint. The agents themselves are the most replaceable part — I could swap models tomorrow and the workflow keeps running.

That's the inversion that took me longest to get to: the AI isn't the workflow. The AI is a node in the workflow. The scaffolding is what gives it leverage.

## What I won't let it do (yet)

A short list of things I still don't trust it for:

- Anything that sends external messages. Cover letters get generated, but I send them. Emails get drafted, not sent. Slack posts get suggested, not posted.
- Anything irreversible. Deleting files, dropping rows, force-pushing, `terraform destroy`. The agent fleet can comment on a `terraform plan`; it doesn't run `terraform apply`.
- Anything that costs money beyond a budget cap. Per-key spending limits live on the AI's own API keys, not mine.
- Production code in a client repo. Internal exploration, ideation, refactoring drafts — fine. Direct commits — no. What I push goes through me and through a PR review.

The "(yet)" matters. These aren't permanent boundaries. They're the boundaries where the marginal value of automating them is still less than the marginal cost of one bad call. As the systems around the AI get tighter — better diff review, better verification gates, better rollback paths — the line moves.

---

AI is a tool. That's it.

The work is building the scaffolding around it so it can't do too much harm and can do the things you've already figured out, the same way, every time.

Most of what people call "AI workflow" is just workflow with an AI in it. The workflow part is doing the work.
