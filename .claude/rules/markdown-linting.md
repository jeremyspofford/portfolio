# Markdown Linting Standards

> **Trigger:** Always-on (applies to all markdown file operations)
> **Applies to:** `**/*.md`, `**/*.mdc`

This repository enforces **strict markdown linting** for all markdown files. All markdown files MUST pass markdownlint validation before being committed.

## Mandatory Rule: MD040 - Fenced Code Language

**ALL fenced code blocks MUST specify a language identifier. MD040 errors MUST always be fixed whenever a markdown file is modified.**

### MD040 Rule

- Every code block using triple backticks must include a language tag
- **If you're unsure of the correct language to use, use `markdown` as the default**
- Code blocks without language tags will fail linting
- **This rule applies whenever ANY markdown file is modified** - always check and fix MD040 violations

### MD040 Examples

**Incorrect (missing language tag):**

<!-- markdownlint-disable-next-line MD040 -->
```
my code block (unsure of language)
```

**Correct (using markdown as default when unsure):**

```markdown
my code block (unsure of language)
```

**Incorrect (code without language):**

<!-- markdownlint-disable-next-line MD040 -->
```
const x = 1;
```

**Correct (with appropriate language):**

```javascript
const x = 1;
```

## Common Language Tags

Use appropriate language tags for code blocks:

| Extension | Language Tag |
| --------- | ------------ |
| Shell | `bash` / `sh` |
| JavaScript | `javascript` / `js` |
| TypeScript | `typescript` / `ts` |
| JSON | `json` |
| YAML | `yaml` / `yml` |
| Markdown | `markdown` / `md` |
| Python | `python` / `py` |
| SQL | `sql` |
| HTML | `html` |
| CSS | `css` |
| Git diffs | `diff` |
| Docker | `dockerfile` |

## Linting Commands

```bash
# Run markdown linting
npm run lint:md

# Fix auto-fixable issues (some rules)
npm run lint:md -- --fix
```

## Mandatory Rule: MD060 - Table Column Style

**ALL markdown tables MUST use proper spacing around pipes for the "compact" style.**

### MD060 Rule

- Table separator rows (the row with dashes) MUST have spaces on both sides of each pipe
- Table data rows should have spaces around pipes for consistency
- The "compact" style requires: `| -------- | ----- | ----- |` (spaces around pipes and dashes)

### MD060 Examples

**Incorrect:**

```markdown
| Resource | Admin | Dev |
|----------|-------|-----|
| Domain | Y | - |
```

**Correct:**

```markdown
| Resource | Admin | Dev |
| -------- | ----- | --- |
| Domain | Y | - |
```

## Auto-Fixing Formatting

**Always fix markdown formatting errors when creating or modifying markdown files.**

- **MD040: Always add language tags to fenced code blocks (use `markdown` as default if unsure)**
- Ensure lists are properly indented
- Ensure there are empty lines around headers and code blocks
- Ensure table formatting is correct (MD060: spaces around pipes in separator rows)
- If you notice formatting errors in a file you are editing (even if not caused by your changes), you are encouraged to fix them to maintain documentation quality
