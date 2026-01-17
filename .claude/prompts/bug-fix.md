# Bug Fix Prompt Template

Copy this template and customize for your bug fix.

---

## Objective

Fix [BUG DESCRIPTION] following TDD methodology.

## Bug Details

- **Reported behavior**: [What is happening]
- **Expected behavior**: [What should happen]
- **Steps to reproduce**: [How to trigger the bug]
- **Affected files**: [Files likely involved]

## Root Cause Analysis

Before fixing, investigate:

1. Read the affected code paths
2. Understand the current behavior
3. Identify the root cause (not just symptoms)
4. Document findings

## Requirements

### The Fix Must

1. Resolve the reported issue
2. Not introduce regressions
3. Have a failing test that reproduces the bug
4. Pass all existing tests after the fix

### Edge Cases to Consider

- [ ] Related scenarios that might be affected
- [ ] Similar code paths that might have the same issue
- [ ] Boundary conditions near the bug

## Constraints

- **TDD Required**: Write a failing test that reproduces the bug FIRST
- Do not change unrelated code
- Minimal changes to fix the issue
- All existing tests must continue passing

## Implementation Steps

1. **Reproduce** - Confirm the bug exists
2. **Test** - Write a failing test that captures the bug
3. **Fix** - Make minimal changes to pass the test
4. **Verify** - Ensure no regressions
5. **Document** - Update comments if behavior was unclear

## Test Commands

```bash
# Run specific test file
npm run test -- [test-file-path]

# Run all tests (check for regressions)
npm run test

# Type check
npm run typecheck

# Lint
npm run lint
```

## Completion Criteria

When ALL of the following are true:

- [ ] Bug is reproducible in test
- [ ] Fix resolves the failing test
- [ ] No regressions in existing tests
- [ ] Type check clean
- [ ] Lint clean

Output:

```markdown
RALPH_STATUS:
  COMPLETION_INDICATORS: ["Bug fixed", "All tests passing", "No regressions"]
  EXIT_SIGNAL: true

LOOP_COMPLETE
```

## Notes

[Add any additional context about the bug here]
