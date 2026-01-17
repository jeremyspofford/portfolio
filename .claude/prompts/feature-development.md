# Feature Development Prompt Template

Copy this template and customize for your feature.

---

## Objective

Implement [FEATURE NAME] following TDD methodology.

## Context

- **Location**: [File path or module where feature belongs]
- **Related files**: [List related files to read first]
- **Existing patterns**: [Reference similar implementations]

## Requirements

### Functional Requirements

1. [Requirement 1 - be specific and testable]
2. [Requirement 2]
3. [Requirement 3]

### Non-Functional Requirements

- [ ] Tests with 80%+ coverage
- [ ] Type-safe (no `any` types)
- [ ] Follows existing code patterns
- [ ] Error handling for edge cases

### Edge Cases to Handle

- [ ] Empty/null inputs
- [ ] Invalid data formats
- [ ] Boundary conditions
- [ ] Error states

## Constraints

- Follow TDD: Write failing test BEFORE implementation
- Use existing patterns from the codebase
- No breaking changes to existing functionality
- All code must pass linting and type checking

## Implementation Steps

1. **Read** existing related files to understand patterns
2. **Write** failing tests for requirements
3. **Implement** minimal code to pass tests
4. **Refactor** for clarity and maintainability
5. **Verify** with full test suite, typecheck, and lint

## Test Commands

```bash
# Run specific tests
npm run test -- [test-file-path]

# Run all tests
npm run test

# Type check
npm run typecheck

# Lint
npm run lint
```

## Completion Criteria

When ALL of the following are true:

- [ ] All functional requirements implemented
- [ ] All edge cases handled
- [ ] All tests passing (80%+ coverage)
- [ ] Type check clean
- [ ] Lint clean
- [ ] No regressions in existing tests

Output:

```markdown
RALPH_STATUS:
  COMPLETION_INDICATORS: ["All requirements implemented", "All tests passing", "Type check clean"]
  EXIT_SIGNAL: true

LOOP_COMPLETE
```

## Notes

[Add any additional context, constraints, or guidance here]
