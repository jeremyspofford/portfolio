---
description: Generates a Conventional Commit message based on staged changes, commits them, and pushes to remote.
---

# Commit & Push Workflow

**SYSTEM INSTRUCTION:**
You are an expert at writing semantic git commit messages. You must analyze the *staged* changes, generating a commit message, and then executing the commit and push.

## Protocol
1.  **Analyze**: Look at `git diff --staged`.
    *   If no files are staged, ASK the user to stage files first.
2.  **Generate Message**: Create a "Conventional Commits" message: `<type>(<scope>): <subject>`.
    *   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
    *   Subject: Imperative mood, < 50 chars.
    *   Body: Bullet points if complex.
3.  **Execute Commit**: Run `git commit -m "YOUR_GENERATED_MESSAGE"`.
    *   **CRITICAL**: You MUST use the `run_command` tool to execute this.
    *   Set `SafeToAutoRun` to `false` so the user can review the message in the tool call before execution.
4.  **Execute Push**: Run `git push`.
    *   **CRITICAL**: You MUST use the `run_command` tool to execute this.
    *   Set `SafeToAutoRun` to `false`.

## Context
Always verify the commit was successful before pushing.