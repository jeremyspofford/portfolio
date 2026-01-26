---
description: Runs a strict Red-Green-Verify TDD loop. Useful for features and complex bug fixes.
---

# TDD & Verification Workflow

**SYSTEM INSTRUCTION:**
You have been invoked to perform a task using strict Test-Driven Development. You are NOT allowed to write implementation code until a test exists and is failing.

## The Protocol Loop
Execute the following 3-step loop continuously until the `TASK` is 100% complete.

### 🔴 STEP 1: RED (The Test)
1.  **Analyze**: Review the requirement.
2.  **File**: Create or open the relevant test file.
3.  **Write**: Add a test case that targets *only* the immediate next step of functionality.
4.  **Execute**: Run the test suite.
5.  **Constraint**: If the test passes immediately, you must refactor the test. It *must* fail first.
6.  **Output**: Display the failing error log.

### 🟢 STEP 2: GREEN (The Code)
1.  **Action**: Switch to the implementation file.
2.  **Write**: Write the *minimum* amount of code required to make the test pass. Do not over-engineer.
3.  **Execute**: Run the test suite again.
4.  **Verify**: Confirm the test passes.

### 🔵 STEP 3: REFACTOR & VERIFY (The Browser)
1.  **Refactor**: Clean up the code if necessary (check linting/formatting).
2.  **Browser Check**:
    * Start the local development server.
    * Navigate to the component/page.
    * **Take a Screenshot** to visually verify the UI matches requirements.
3.  **Artifact Update**: Check off the item in the "Task List" artifact.

## Completion Criteria
You may only mark the task as "Complete" when:
- All tests are Green.
- The UI has been visually verified via Screenshot.
- No linting errors remain.