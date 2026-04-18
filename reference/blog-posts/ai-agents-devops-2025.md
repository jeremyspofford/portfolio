---
title: "AI Agents Are Changing DevOps — Here's What I've Learned"
date: "2025-01-30"
description: "After months of building AI-powered automation, here's what actually works, what doesn't, and why the future of DevOps is collaborative intelligence."
tags: ["AI", "DevOps", "Automation", "Future of Work"]
---

# AI Agents Are Changing DevOps

There's a lot of hype around AI agents right now. Every vendor claims their solution will "transform your workflow" and "10x your productivity." Having spent the last few months actually building and using AI agents for real DevOps work, I want to share what I've learned.

**TL;DR:** AI agents are genuinely useful, but not in the ways most people expect.

## What Actually Works

### 1. Autonomous Monitoring and Alerting

The best use case I've found is giving AI agents read access to logs, metrics, and dashboards, then letting them summarize and alert intelligently.

Instead of:
```
ALERT: CPU > 80% on prod-web-03
ALERT: CPU > 80% on prod-web-03
ALERT: CPU > 80% on prod-web-03
```

I now get:
```
prod-web-03 has been running hot for 15 minutes. 
Looking at the logs, it started after deployment #847.
The new endpoint /api/reports is doing full table scans.
Suggested fix: Add index on reports.created_at
```

That's the difference between noise and signal.

### 2. Documentation That Stays Current

I have an agent that watches my infrastructure repos and keeps documentation in sync. When I change a Terraform module, it updates the README. When I add a new service, it updates the architecture diagram descriptions.

Is it perfect? No. But it's better than documentation that's 6 months stale.

### 3. Incident Response Copilot

During incidents, context-switching is deadly. An AI agent that can:
- Pull relevant runbooks
- Check recent deployments
- Query metrics
- Search Slack history for similar issues

...while I focus on the actual problem? That's genuinely helpful.

## What Doesn't Work (Yet)

### ❌ Fully Autonomous Infrastructure Changes

I've seen people try to give AI agents `terraform apply` access. Please don't. The failure modes are creative and expensive.

AI is great for *drafting* changes. Humans should approve them.

### ❌ Replacing On-Call

AI agents can help with triage and initial diagnosis, but complex incidents still need human judgment. The agent doesn't know that the CEO demo is in 30 minutes, or that we're in a code freeze.

### ❌ Security-Sensitive Operations

Anything involving secrets, access controls, or production data should stay human-gated. AI agents are too unpredictable for high-stakes decisions.

## The Architecture That Works

After a lot of trial and error, here's the pattern I've settled on:

```
┌─────────────────────────────────────────┐
│           Human Operator                │
│   (Approvals, Strategy, Judgment)       │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│            AI Agent Layer               │
│  (Monitoring, Drafting, Summarizing)    │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Automation Layer                │
│    (Terraform, Ansible, CI/CD)          │
└─────────────────────────────────────────┘
```

The AI agent sits *between* me and the automation. It handles the cognitive load of understanding what's happening and drafting responses. I handle the judgment calls.

## Practical Tips

### 1. Start with Read-Only

Give your agent read access first. Let it observe, summarize, and suggest. Only add write access for low-risk operations after you trust it.

### 2. Build in Guardrails

Every destructive action should require confirmation. Every expensive action should have a cost estimate. Every production change should notify humans.

### 3. Keep Humans in the Loop

The best AI agents make humans more effective, not redundant. If you're designing a system where humans are optional, you're designing a system that will fail in interesting ways.

### 4. Embrace Async

AI agents excel at background work. Set them up to:
- Monitor continuously
- Draft PRs for review
- Prepare incident reports
- Summarize log patterns

Let them work while you sleep. Review their output when you're fresh.

## What's Next?

I'm currently building a system where AI agents can:
- Discover startup ideas from public sources
- Evaluate feasibility and market opportunity
- Draft proof-of-concept implementations
- Notify me when something's worth my attention

The goal isn't to replace human creativity — it's to expand what one person can reasonably explore.

## The Honest Take

AI agents are tools. Really powerful tools. But like any powerful tool, they require skill to use effectively and can cause real damage when misused.

The DevOps engineers who thrive in the next few years won't be the ones who resist AI, and they won't be the ones who blindly trust it. They'll be the ones who learn to collaborate with it — using AI to handle the repetitive cognitive work while focusing their human judgment on what actually matters.

That's the future I'm building toward.

---

*What's your experience with AI agents in DevOps? I'd love to hear what's working (or not) for you. Find me on [GitHub](https://github.com/jeremyspofford) or [LinkedIn](https://linkedin.com/in/jeremyspofford).*
