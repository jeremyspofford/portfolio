# TDD Workflow: The Ralph Loop

> **Trigger:** Manual (invoke when doing feature development or bug fixes)
> **Description:** Strict Test-Driven Development workflow

This repository enforces a **strict Test-Driven Development (TDD)** workflow called the "Ralph Loop". All feature development and bug fixes MUST follow this process.

## The Ralph Loop Phases

### Phase 1: Red (Test First)

**Create a failing test case for the requested feature.**

- Write a test that describes the expected behavior
- The test MUST fail initially (this confirms the test is valid)
- Do NOT write any implementation code yet
- Run the test suite to confirm the test fails with a meaningful error

```bash
# Run tests to confirm failure
npm run test:fe   # Frontend tests
npm run test:be   # Backend tests
npm run test      # All tests
```

**Output example:**

```markdown
X should calculate total price with discount
  Expected: 90
  Received: undefined
```

### Phase 2: Green (Minimal Implementation)

**Write the MINIMAL code to make the test pass.**

- Only write enough code to make the failing test pass
- Do not add extra features, optimizations, or "nice to haves"
- Do not refactor yet - ugly code that passes is fine at this stage
- Run the test suite to confirm the test now passes

```bash
# Run tests to confirm pass
npm run test
```

**Output example:**

```markdown
Y should calculate total price with discount
```

### Phase 3: Refactor (Simplify)

**Run a "code simplifier" pass without breaking tests.**

Check for and address:

- **Complexity**: Can this be simplified? Are there unnecessary conditionals?
- **Duplication**: Is there repeated code that can be extracted?
- **Messy logic**: Are variable names clear? Is the flow obvious?
- **SOLID principles**: Single responsibility? Open for extension?

After each refactor change:

```bash
# Verify tests still pass after refactoring
npm run test
npm run typecheck
```

**CRITICAL**: Tests must remain green throughout refactoring. If a test fails, revert the change.

### Phase 4: Verify (Browser)

**Use browser tools to verify the fix works in a real context.**

For frontend changes, this is **MANDATORY**. "Verification" means actually running the code and checking the browser DOM/Console via tools - NOT just visually inspecting the code.

Use the browser MCP tools to:

1. **Navigate** to the relevant page:

   ```markdown
   browser_navigate -> http://localhost:4173/your-route
   ```

2. **Take a snapshot** to get element references:

   ```markdown
   browser_snapshot -> Get accessibility tree and element refs
   ```

3. **Interact** with the UI if needed:

   ```markdown
   browser_click, browser_type, browser_fill_form
   ```

4. **Check console** for errors:

   ```markdown
   browser_console_messages -> Verify no errors/warnings
   ```

5. **Verify network requests** if applicable:

   ```markdown
   browser_network_requests -> Check API calls succeed
   ```

**Important**: For backend-only changes, verify via:

- API testing (curl/httpie to localhost:3000)
- Integration tests
- Checking logs for expected behavior

### Phase 5: Loop or Complete

**Evaluate completion status.**

Ask yourself:

- Does the feature fully meet the requirements?
- Are all edge cases handled and tested?
- Is the code clean and well-documented?
- Have all tests passed (unit, integration, type checking)?
- Has browser verification confirmed the fix works?

**If incomplete**: Return to Phase 1 with the next sub-task.

**If complete**: Output the completion signal:

```markdown
RALPH_loop_COMPLETE
```

## Critical Rules

### Verification Means Execution

"Verification" does NOT mean:

- Looking at the code and saying "this looks right"
- Assuming the test passing means the UI works
- Skipping browser checks for "simple" changes

"Verification" DOES mean:

- Running `npm run test` and seeing green output
- Using `browser_snapshot` to check actual DOM state
- Using `browser_console_messages` to confirm no errors
- Interacting with the UI via `browser_click`/`browser_type`
- Checking `browser_network_requests` for API correctness

### Test Commands Reference

```bash
# Full test suite
npm run test

# Workspace-specific tests
npm run test:fe              # Frontend (Vitest + React Testing Library)
npm run test:be              # Backend (Vitest)
npm run test:infra           # Infrastructure (Jest)

# Single file
npm run test:be -- src/services/MyService.test.ts
npm run test:fe -- src/components/MyComponent.test.tsx

# Watch mode (for rapid iteration)
cd apps/server && npm run test:unit:watch
cd apps/quoting-studio && npm run test -- --watch

# Type checking (required before completion)
npm run typecheck
```

### Browser Verification Checklist

Before outputting `RALPH_loop_COMPLETE` for any frontend change:

- [ ] `browser_navigate` to the affected page
- [ ] `browser_snapshot` shows expected elements
- [ ] `browser_console_messages` shows no new errors
- [ ] Interactive elements respond correctly (if applicable)
- [ ] `browser_network_requests` show successful API calls (if applicable)

## Example Ralph Loop Session

**Task**: Add a "Clear All" button to the project list

**Phase 1 (Red)**:

```typescript
// apps/quoting-studio/src/components/ProjectList.test.tsx
it('should clear all projects when Clear All button is clicked', async () => {
  render(<ProjectList projects={mockProjects} />)

  await userEvent.click(screen.getByRole('button', { name: /clear all/i }))

  expect(screen.queryByTestId('project-card')).not.toBeInTheDocument()
})
```

Run `npm run test:fe` -> Test fails (button doesn't exist)

**Phase 2 (Green)**:

```typescript
// apps/quoting-studio/src/components/ProjectList.tsx
<Button onClick={() => setProjects([])}>Clear All</Button>
```

Run `npm run test:fe` -> Test passes

**Phase 3 (Refactor)**:

- Extract button handler to named function
- Add confirmation dialog for safety
- Ensure tests still pass after each change

**Phase 4 (Verify)**:

```markdown
browser_navigate -> http://localhost:4173/projects
browser_snapshot -> Confirm "Clear All" button exists
browser_click -> Click the button
browser_snapshot -> Confirm projects are cleared
browser_console_messages -> No errors
```

**Phase 5 (Complete)**:

```markdown
RALPH_loop_COMPLETE
```
