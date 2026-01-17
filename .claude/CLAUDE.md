# Project Guidelines for Claude Code

This file contains project-specific guidelines for Claude Code AI assistant.

## Project Overview

- **Name:** [Your Project Name]
- **Purpose:** [What this project does]
- **Tech Stack:** [Languages, frameworks, tools]

## Repository Structure

[Describe your project structure]

## Development Setup

- **Dependencies:** [How to install]
- **Environment:** [Local dev setup]
- **Testing:** [How to run tests]

## Coding Standards

- Follow the rules in `.claude/rules/`
- Follow TDD workflow from `.claude/rules/tdd-workflow.md`
- TypeScript: No `any`, prefer `interface`
- Markdown: All code blocks must have language tags (MD040)

## Secrets Management

**CRITICAL**: Never commit secrets, API keys, credentials, or passwords to the repository.

### Protection Layers

1. **`.gitignore`**: Blocks `.env`, credentials files, private keys from being staged
2. **`git-secrets`**: Scans commits for secret patterns (AWS keys, tokens, etc.)
3. **Lefthook**: Runs git-secrets automatically on every commit

### Quick Reference

```bash
# Store secrets in .env (never committed)
echo "API_KEY=your-secret-here" >> .env

# Create safe template
cp .env .env.example
# Edit .env.example to replace real values with placeholders

# Install git-secrets (one-time setup)
brew install git-secrets           # macOS
sudo apt-get install git-secrets   # Linux

# Lefthook will auto-initialize git-secrets on first commit
```

### If You Accidentally Commit a Secret

1. **IMMEDIATELY rotate** the exposed credential (revoke old, generate new)
2. Remove from git history: `git filter-repo --path secretfile --invert-paths`
3. Force push (if not on shared branch): `git push --force-with-lease`
4. See [`.claude/rules/secrets-management.md`](.claude/rules/secrets-management.md) for detailed recovery steps

**Remember**: Secrets in git history are compromised forever. Rotation is mandatory.

For detailed guidance, see [`.claude/rules/secrets-management.md`](.claude/rules/secrets-management.md).

## Project-Specific Plugins

Configure in `.claude/config.json`:

```json
{
  "enabledPlugins": {
    // Add project-specific plugins here
  }
}
```

## Common Commands

- Tests: `npm run test`
- Build: `npm run build`
- Lint: `npm run lint`

## Getting Help

Refer to `.claude/rules/` for coding standards and workflows.
