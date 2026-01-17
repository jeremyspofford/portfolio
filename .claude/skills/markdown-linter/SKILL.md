---
name: markdown-linter
description: Markdown linting and fixing tool. Validates markdown files against project standards (MD040 fenced code blocks, MD060 tables, formatting). Auto-fixes issues and provides detailed linting reports. Use when checking or fixing markdown files.
---

# Markdown Linter

Validate and fix markdown files against project linting standards.

---

## Quick Start

### What to Check

When linting a markdown file:

1. **MD040 - Fenced Code Blocks**
   - Every code block must have a language tag
   - Default to `markdown` if unsure

2. **MD060 - Table Formatting**
   - Table separators need spaces around pipes
   - Format: `| ------- | ------- |`

3. **General Formatting**
   - Blank lines around headers
   - Proper list indentation
   - Consistent spacing

### How to Fix

```markdown
# WRONG - No language tag
```
const x = 1;
```

# CORRECT - Has language tag
```javascript
const x = 1;
```

---

## MD040: Fenced Code Block Language

**Rule**: Every fenced code block MUST have a language tag.

### Problem

Code blocks without language tags:
- Reduce readability
- Break syntax highlighting
- Fail linting validation

### Solution

Add language identifier to opening backticks:

```markdown
# WRONG
```
code here
```

# CORRECT
```javascript
code here
```
```

### Language Tag Reference

| Use Case | Tags | Example |
| -------- | ---- | ------- |
| Shell scripts | `bash`, `sh` | `bash` |
| JavaScript | `javascript`, `js` | `javascript` |
| TypeScript | `typescript`, `ts` | `typescript` |
| Python | `python`, `py` | `python` |
| JSON | `json` | `json` |
| YAML | `yaml`, `yml` | `yaml` |
| SQL | `sql` | `sql` |
| HTML | `html` | `html` |
| CSS | `css` | `css` |
| Docker | `dockerfile` | `dockerfile` |
| Git diffs | `diff` | `diff` |
| Markdown | `markdown`, `md` | `markdown` |
| When unsure | `markdown` | `markdown` |

### Examples

**Shell Script**
```bash
#!/bin/bash
echo "Hello World"
```

**JavaScript**
```javascript
function greet(name) {
  return `Hello ${name}`;
}
```

**JSON Configuration**
```json
{
  "name": "example",
  "version": "1.0.0"
}
```

**YAML Config**
```yaml
database:
  host: localhost
  port: 5432
```

**SQL Query**
```sql
SELECT * FROM users WHERE id = 1;
```

**TypeScript**
```typescript
interface User {
  id: number;
  name: string;
}
```

**Python**
```python
def greet(name: str) -> str:
    return f"Hello {name}"
```

---

## MD060: Table Column Spacing

**Rule**: Table separator rows must have spaces around pipes for the "compact" style.

### Problem

Improperly formatted tables:
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1 | Cell 2 |
```

### Solution

Add spaces around pipes and dashes:
```markdown
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1 | Cell 2 |
```

### Format Guide

**Table Components**:
```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data A   | Data B   | Data C   |
| Data X   | Data Y   | Data Z   |
```

**Key Points**:
- Header row: `| text | text |`
- Separator: `| ------- | ------- |` (spaces around pipes)
- Data rows: `| text | text |`
- All pipes aligned vertically (helps readability)

### Common Mistakes

**WRONG - No spaces around dashes**:
```markdown
| Name | Age |
|-----|-----|
| John | 30 |
```

**CORRECT - Spaces around dashes**:
```markdown
| Name | Age |
| ---- | --- |
| John | 30 |
```

**WRONG - Inconsistent formatting**:
```markdown
| Role | Permissions |
|---|---|
| Admin | Full Access |
```

**CORRECT - Consistent spacing**:
```markdown
| Role | Permissions |
| ---- | ----------- |
| Admin | Full Access |
```

---

## General Formatting Standards

### Headings

**Blank line before and after headers**:
```markdown
# Good Practice

Blank line before header ✓
Blank line after header ✓

## Subheading

Content continues...
```

### Code Blocks

**Blank lines around code blocks**:
```markdown
Here's an example:

```javascript
const code = "example";
```

More content...
```

### Lists

**Proper indentation**:
```markdown
- Item 1
- Item 2
  - Nested item
  - Another nested
- Item 3
```

---

## Linting Checklist

When reviewing markdown:

- [ ] All code blocks have language tags
- [ ] No code blocks use just ` ``` `
- [ ] Table separators have spaces around pipes
- [ ] Blank lines before/after headers
- [ ] Blank lines around code blocks
- [ ] Lists properly indented
- [ ] No extra spaces at line ends
- [ ] Links are valid
- [ ] Images are referenced correctly

---

## Fixing Workflow

### Step 1: Identify Issues
```
Read file
Note MD040 violations (missing language tags)
Note MD060 violations (table spacing)
Note formatting issues
```

### Step 2: Fix Code Blocks
```markdown
# For each code block without language tag:
# Add appropriate language identifier

# BEFORE:
```
const x = 1;
```

# AFTER:
```javascript
const x = 1;
```
```

### Step 3: Fix Tables
```markdown
# For each table, ensure separator uses spaces:

# BEFORE:
| Header |
|--------|

# AFTER:
| Header |
| ------ |
```

### Step 4: Fix Formatting
- Ensure blank lines around major sections
- Fix list indentation
- Remove trailing spaces

### Step 5: Verify
- All code blocks have language tags
- All tables properly formatted
- No MD040 or MD060 violations

---

## Common Patterns by Context

### Bash Script Block
```bash
#!/bin/bash
echo "Running script"
```

### TypeScript Type Definition
```typescript
interface Config {
  name: string;
  port: number;
}
```

### Configuration Examples
```yaml
# Using YAML for config
server:
  host: localhost
  port: 3000
```

```json
{
  "server": {
    "host": "localhost",
    "port": 3000
  }
}
```

### Git Diff Example
```diff
- old line
+ new line
```

### Documentation Table
```markdown
| Feature | Status | Notes |
| ------- | ------ | ----- |
| Auth | ✅ | Working |
| API | ⚠️ | In progress |
| Tests | ❌ | Not started |
```

---

## Output Format

### Linting Report
```
## Markdown Linting Report

### Issues Found

**MD040 - Fenced Code Blocks (MUST FIX)**
- Line 42: Missing language tag
- Line 87: Missing language tag
Count: 2

**MD060 - Table Formatting (MUST FIX)**
- Line 15: Table spacing issue
Count: 1

**Formatting Issues**
- Line 5: Missing blank line before header
- Line 120: Extra trailing space
Count: 2

### Fixes Applied

✅ Added language tags to 2 code blocks
✅ Fixed table separator spacing (1 table)
✅ Added blank lines around headers
✅ Removed trailing spaces

### Result

Status: ✅ PASS
All mandatory rules (MD040, MD060) fixed
All formatting issues resolved
```

---

## Quick Reference

**Run markdown linting**: "Lint this markdown" or "Check markdown file"
**Fix issues**: "Fix markdown linting issues"
**Verify**: "Verify markdown passes linting"

**Key Rules**:
1. Code blocks MUST have language tags (MD040)
2. Tables MUST have proper spacing (MD060)
3. Blank lines before/after headers
4. Proper list indentation

**When in Doubt**:
- Use `markdown` as default language tag
- Add spaces around all table pipes
- Add blank lines for readability

---

For project-specific markdown rules, see `.claude/rules/markdown-linting.md`
