---
trigger: always_on
---

# Markdown Linting Standards

This repository enforces **strict markdown linting** for all markdown files. All markdown files MUST pass markdownlint validation before being committed.

## Mandatory Rule: MD040 - Fenced Code Language

**ALL fenced code blocks MUST specify a language identifier. MD040 errors MUST always be fixed whenever a markdown file is modified.**

### MD040 Rule

- Every code block using triple backticks (```) MUST include a language tag
- **If you're unsure of the correct language to use, use `markdown` as the default**
- Code blocks without language tags will fail linting
- **This rule applies whenever ANY markdown file is modified** - always check and fix MD040 violations

### MD040 Examples

**❌ Incorrect (missing language tag):**

The following code block is missing a language identifier:

<!-- markdownlint-disable-next-line MD040 -->
```
my code block (unsure of language)
```

**✅ Correct (using markdown as default when unsure):**

Add `markdown` as the language when uncertain:

```markdown
my code block (unsure of language)
```

**❌ Incorrect (code without language):**

The following code block is missing a language identifier:

<!-- markdownlint-disable-next-line MD040 -->
```
const x = 1;
```

**✅ Correct (with appropriate language):**

Use the appropriate language identifier:

```javascript
const x = 1;
```

**❌ Incorrect (plain text without language):**

The following code block is missing a language identifier:

<!-- markdownlint-disable-next-line MD040 -->
```
Some plain text or unknown format
```

**✅ Correct (using markdown as default):**

Use `markdown` as the default when the language is unknown:

```markdown
Some plain text or unknown format
```

## Common Language Tags

Use appropriate language tags for code blocks:

- `bash` / `sh` - Shell scripts and terminal commands
- `javascript` / `js` - JavaScript code
- `typescript` / `ts` - TypeScript code
- `json` - JSON data
- `yaml` / `yml` - YAML configuration
- `markdown` / `md` - Markdown content or plain text
- `text` - Plain text (prefer `markdown` for documentation)
- `python` / `py` - Python code
- `sql` - SQL queries
- `html` - HTML markup
- `css` - CSS styles
- `diff` - Git diffs
- `dockerfile` - Dockerfile content

## Linting Commands

```bash
# Run markdown linting
npm run lint:md

# Fix auto-fixable issues (some rules)
npm run lint:md -- --fix
```

## Pre-Commit Validation

Markdown files are automatically validated:

- Before git commits (via Lefthook)
- In CI/CD pipeline
- During code reviews

## Fixing MD040 Violations

**MD040 errors MUST be fixed whenever a markdown file is modified.** When you encounter MD040 errors:

1. Identify the code block without a language tag
2. Determine the appropriate language if possible
3. **If uncertain or the content is plain text, use `markdown` as the default**
4. Add the language identifier immediately after the opening triple backticks

**Example fix:**

Before (incorrect - missing language tag):

<!-- markdownlint-disable-next-line MD040 -->
```
my code block (unsure of language)
```

After (correct - using markdown as default):

```markdown
my code block (unsure of language)
```

## Integration with AI Assistants

All AI coding assistants (Cursor, Claude, Gemini) MUST:

- **Always add language tags to all code blocks when creating or editing markdown files**
- **Use `markdown` as the default when the language is unknown or uncertain**
- **Fix all MD040 violations whenever a markdown file is modified**
- Run `npm run lint:md` before completing markdown file changes
- Fix all MD040 violations before outputting completion signals

## Mandatory Rule: MD060 - Table Column Style

**ALL markdown tables MUST use proper spacing around pipes for the "compact" style.**

### MD060 Rule

- Table separator rows (the row with dashes) MUST have spaces on both sides of each pipe
- Table data rows should have spaces around pipes for consistency
- The "compact" style requires: `| -------- | ----- | ----- |` (spaces around pipes and dashes)

### MD060 Examples

**❌ Incorrect:**

```markdown
| Resource | Admin | Dev |
|----------|-------|-----|
| Domain | ✅ | - |
```

**✅ Correct:**

```markdown
| Resource | Admin | Dev |
| -------- | ----- | --- |
| Domain | ✅ | - |
```

**❌ Incorrect (missing spaces in separator):**

```markdown
| Option | Description | Default |
|--------|-------------|---------|
```

**✅ Correct:**

```markdown
| Option | Description | Default |
| ------ | ----------- | ------- |
```

## Auto-Fixing Formatting

**Always fix markdown formatting errors when creating or modifying markdown files.**

- **MD040: Always add language tags to fenced code blocks (use `markdown` as default if unsure)**
- Ensure lists are properly indented.
- Ensure there are empty lines around headers and code blocks.
- Ensure table formatting is correct (MD060: spaces around pipes in separator rows).
- If you notice formatting errors in a file you are editing (even if not caused by your changes), you are encouraged to fix them to maintain documentation quality.