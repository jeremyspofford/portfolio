# Test Coverage Improvement Prompt Template

Copy this template and customize for your testing goals.

---

## Objective

Improve test coverage for [MODULE/COMPONENT] to meet quality standards.

## Current State

- **Target files**: [Files that need more tests]
- **Current coverage**: [If known, e.g., "60% statements"]
- **Target coverage**: [e.g., "80% statements"]
- **Testing framework**: [e.g., "Vitest with React Testing Library"]

## Requirements

### Coverage Goals

- [ ] Statement coverage: 80%+
- [ ] Branch coverage: 75%+
- [ ] Function coverage: 80%+

### Test Categories to Add

1. **Happy Path Tests**
   - [ ] Normal operation scenarios
   - [ ] Expected inputs produce expected outputs

2. **Edge Case Tests**
   - [ ] Empty/null/undefined inputs
   - [ ] Boundary values (0, max, min)
   - [ ] Invalid formats

3. **Error Handling Tests**
   - [ ] Expected errors are thrown
   - [ ] Error messages are correct
   - [ ] Recovery scenarios

4. **Integration Tests** (if applicable)
   - [ ] Component interactions
   - [ ] API call handling
   - [ ] State management

## Constraints

- Follow AAA pattern (Arrange-Act-Assert)
- Use descriptive test names
- One assertion concept per test
- Mock external dependencies
- No testing implementation details

## Test Structure Template

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    describe('happy path', () => {
      it('should [expected behavior] when [condition]', () => {
        // Arrange
        const input = { /* test data */ };

        // Act
        const result = methodName(input);

        // Assert
        expect(result).toEqual(expected);
      });
    });

    describe('edge cases', () => {
      it('should handle empty input', () => { /* ... */ });
      it('should handle null values', () => { /* ... */ });
    });

    describe('error handling', () => {
      it('should throw ValidationError for invalid input', () => { /* ... */ });
    });
  });
});
```

## Implementation Steps

1. **Analyze** - Run coverage report to identify gaps
2. **Prioritize** - Focus on untested critical paths first
3. **Write tests** - Add tests for each gap
4. **Verify** - Check coverage improved
5. **Review** - Ensure tests are meaningful, not just for coverage

## Test Commands

```bash
# Run tests with coverage
npm run test -- --coverage

# Run specific file
npm run test -- [test-file-path]

# Watch mode for rapid iteration
npm run test -- --watch
```

## Completion Criteria

When ALL of the following are true:

- [ ] Statement coverage meets target (80%+)
- [ ] All new tests pass
- [ ] Tests are meaningful (not just coverage padding)
- [ ] No flaky tests introduced
- [ ] Test patterns match existing codebase

Output:

```markdown
RALPH_STATUS:
  COMPLETION_INDICATORS: ["Coverage target met", "All tests passing", "Quality tests added"]
  EXIT_SIGNAL: true

LOOP_COMPLETE
```

## Notes

[Add any specific areas of concern or known untested functionality]
