# Markdown Linter

Automated markdown linting and fixing based on project standards.

---

## Purpose

Validates and fixes markdown files against project linting rules (MD040, MD060, formatting).

## Activates On

- lint markdown
- check markdown
- fix markdown
- markdown-lint
- validate markdown
- check md files

## Priority

**HIGH** - Enforces mandatory markdown standards before commits

## Coverage

### Rules Enforced

- **MD040** (Mandatory) - Fenced code blocks must have language tags
- **MD060** (Mandatory) - Table columns must have proper spacing
- **Formatting** - Lists, headers, spacing, indentation

### Auto-Fixes

- Add language tags to code blocks (uses `markdown` as default if unsure)
- Fix table separator spacing
- Normalize list indentation
- Add blank lines around headers and blocks

### Language Tags

Applies appropriate tags:
- `bash`, `sh` - Shell scripts
- `javascript`, `js` - JavaScript
- `typescript`, `ts` - TypeScript
- `json` - JSON
- `yaml`, `yml` - YAML
- `markdown`, `md` - Markdown
- `python`, `py` - Python
- `sql` - SQL
- `html`, `css` - Web
- `dockerfile` - Docker
- `diff` - Git diffs

## Quick Usage

```
"Check this markdown file"
"Fix markdown linting issues"
"Validate markdown: [file path]"
"Lint this markdown"
```

## Files

- **SKILL.md** - Markdown linting guide and checklist
- **README.md** - This file

---

**Related**: markdown-linting rule in `.claude/rules/markdown-linting.md`
