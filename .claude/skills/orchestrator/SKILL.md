---
name: orchestrator
description: Orchestration instructions for managing the agent team. Injects delegation patterns into the main conversation so Claude can automatically spawn and coordinate specialized sub-agents.
---

# Agent Orchestrator

Instructions for coordinating the specialized agent team to complete development tasks.

## Table of Contents

- [When to Use This Skill](#when-to-use-this-skill)
- [Available Agents](#available-agents)
- [Orchestration Patterns](#orchestration-patterns)
  - [Pattern 1: Full Feature Development](#pattern-1-full-feature-development)
  - [Pattern 2: Bug Fix](#pattern-2-bug-fix)
  - [Pattern 3: Performance Issue](#pattern-3-performance-issue)
  - [Pattern 4: Code Cleanup](#pattern-4-code-cleanup)
  - [Pattern 5: Quick Task (Use @lead)](#pattern-5-quick-task-use-lead)
- [Decision Tree: Which Pattern to Use](#decision-tree-which-pattern-to-use)
- [Auto-Delegation Rules](#auto-delegation-rules)
- [Communication During Orchestration](#communication-during-orchestration)
- [Example Orchestrated Session](#example-orchestrated-session)
- [Handling Failures](#handling-failures)
- [Summary](#summary)

---

## When to Use This Skill

This skill provides orchestration patterns when the user wants hands-off task completion. The main Claude conversation (not a sub-agent) can spawn sub-agents, so these instructions tell Claude when and how to delegate.

---

## Available Agents

| Agent | Invoke With | Use For |
| ----- | ----------- | ------- |
| `@architect` | Design & planning | New features, system design |
| `@builder` | Implementation | Writing code with TDD |
| `@qa-reviewer` | Code review | Finding bugs and issues |
| `@test-writer` | Test creation | Comprehensive test coverage |
| `@security-auditor` | Security review | Vulnerability assessment |
| `@docs-writer` | Documentation | API docs, READMEs |
| `@perf-optimizer` | Performance | Bottleneck analysis |
| `@refactoring` | Code cleanup | Technical debt |
| `@lead` | Full workflow | End-to-end development |

---

## Orchestration Patterns

### Pattern 1: Full Feature Development

When user requests a new feature:

```text
1. @architect → Creates PLAN.md
2. Present plan to user for approval
3. @builder → Implements Phase 1
4. @qa-reviewer → Reviews Phase 1
5. If issues: @builder fixes, then re-review
6. Repeat steps 3-5 for each phase
7. @docs-writer → Documents the feature
8. @security-auditor → Final security check
9. Report completion to user
```

### Pattern 2: Bug Fix

When user reports a bug:

```text
1. @test-writer → Write failing test that reproduces bug
2. @builder → Fix the bug (make test pass)
3. @qa-reviewer → Review the fix
4. Report completion
```

### Pattern 3: Performance Issue

When user reports slow performance:

```text
1. @perf-optimizer → Analyze and identify bottlenecks
2. @architect → Plan the optimization (if complex)
3. @builder → Implement fixes
4. @perf-optimizer → Verify improvement
5. Report results
```

### Pattern 4: Code Cleanup

When user wants to clean up code:

```text
1. @refactoring → Analyze and create plan
2. @test-writer → Ensure test coverage exists
3. @builder → Execute refactoring steps
4. @qa-reviewer → Verify behavior unchanged
5. Report completion
```

### Pattern 5: Quick Task (Use @lead)

For straightforward tasks where full orchestration is overkill:

```text
1. @lead → Handles everything in one agent
```

The Lead agent combines Architect + Builder + QA into one workflow.

---

## Decision Tree: Which Pattern to Use

```text
Is this a simple, well-defined task?
├── Yes → Use @lead (single agent handles everything)
└── No → Is it a new feature?
    ├── Yes → Use Pattern 1 (Full Feature Development)
    └── No → Is it a bug fix?
        ├── Yes → Use Pattern 2 (Bug Fix)
        └── No → Is it a performance issue?
            ├── Yes → Use Pattern 3 (Performance)
            └── No → Is it code cleanup?
                ├── Yes → Use Pattern 4 (Code Cleanup)
                └── No → Start with @architect to plan
```

---

## Auto-Delegation Rules

When orchestrating, follow these rules:

### Always Delegate To

| Situation | Agent |
| --------- | ----- |
| Need a plan for complex work | `@architect` |
| Need to write/modify code | `@builder` |
| Code was just written | `@qa-reviewer` |
| Tests are needed | `@test-writer` |
| Security-sensitive code | `@security-auditor` |
| Need documentation | `@docs-writer` |
| Performance concerns | `@perf-optimizer` |
| Messy/smelly code | `@refactoring` |

### Check-in Points

Pause and check with user:

- After `@architect` produces a plan (before implementing)
- If `@qa-reviewer` finds HIGH or CRITICAL issues
- If `@security-auditor` finds vulnerabilities
- When making decisions with multiple valid approaches
- Before deleting significant code

### Don't Check-in For

Proceed automatically:

- Moving between phases of an approved plan
- Routine `@builder` → `@qa-reviewer` handoffs
- `@test-writer` creating standard test coverage
- `@docs-writer` documenting what was built

---

## Communication During Orchestration

### Progress Updates

Keep user informed with brief updates:

```markdown
**Progress**: Starting Phase 2 of 3
- ✓ Phase 1: User model and repository (complete)
- → Phase 2: Authentication service (in progress)
- ○ Phase 3: API endpoints (pending)
```

### Agent Handoffs

When delegating, briefly explain:

```markdown
Delegating to @builder to implement the authentication service...
```

### Issue Escalation

When an agent finds issues:

```markdown
**QA Review Found Issues**:
- [HIGH] Missing input validation on email
- [MEDIUM] Error message exposes internal details

Delegating back to @builder to fix these before proceeding...
```

---

## Example Orchestrated Session

**User**: Build a user registration feature with email verification

**Claude** (orchestrating):

```markdown
I'll orchestrate the full development workflow for this feature.

**Step 1**: Delegating to @architect for design...
```

**@architect produces PLAN.md:**

```markdown
**Plan Ready** - @architect designed a 3-phase approach:
1. User model and repository
2. Registration service with email sending
3. Verification endpoint

[Shows key details]

Approve this plan to proceed with implementation?
```

**User**: Yes

```markdown
**Step 2**: Delegating to @builder for Phase 1...
```

**@builder implements, @qa-reviewer reviews:**

```markdown
**Phase 1 Complete**
- User model created
- Repository with create/findByEmail
- 8 tests passing
- QA review: APPROVED

Proceeding to Phase 2...
```

**Continues through all phases:**

```markdown
**Feature Complete**: User Registration with Email Verification

**Summary**:
- Registration endpoint: POST /auth/register
- Verification endpoint: GET /auth/verify/:token
- Email sent via configured SMTP
- Token expires after 24 hours

**Files Created**: 6
**Tests**: 24 passing
**Security Review**: PASSED
**Documentation**: Added to API.md

Anything else you'd like to adjust?
```

---

## Handling Failures

### Agent Fails to Complete

If an agent gets stuck:

1. Report the issue to user
2. Ask for guidance or clarification
3. Resume with adjusted instructions

### Conflicting Agent Outputs

If `@qa-reviewer` finds issues `@builder` can't fix:

1. Escalate to `@architect` for design guidance
2. Present options to user
3. Proceed with chosen approach

### User Wants to Intervene

If user provides direct instructions mid-flow:

1. Pause orchestration
2. Follow user instructions
3. Resume orchestration if appropriate

---

## Summary

- **Simple tasks**: Use `@lead` for end-to-end handling
- **Complex features**: Orchestrate with specialized agents
- **Always get approval** on plans before implementation
- **Keep user informed** with brief progress updates
- **Escalate issues** found by review agents
