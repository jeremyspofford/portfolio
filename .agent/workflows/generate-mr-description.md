---
description: Generate a Merge Request Title and Description based on git changes
---

# Generate Merge Request Title and Description

Analyze the git changes on the current branch and generate a merge request title and description.

## Steps

1. Get the current branch name:
   `git branch --show-current`

2. Get the diff statistics and summary (excluding merge commits):
   `git diff $(git merge-base HEAD origin/dev)..HEAD --stat`

3. Get the commit messages on this branch (excluding merge commits):
   `git log --oneline --no-merges $(git merge-base HEAD origin/dev)..HEAD`

4. Get a summary of the changes:
   `git diff $(git merge-base HEAD origin/dev)..HEAD --name-status`

5. Extract the ticket number from the branch name (e.g., `vc-214` from `vc-214-npm-workspaces`):
   - Pattern: 2-4 letters, followed by `-`, followed by digits
   - If no ticket number is found, omit it from the title

6. Determine the conventional commit type based on the changes:
   - `feat`: New feature
   - `fix`: Bug fix
   - `refactor`: Code restructuring without changing behavior
   - `chore`: Maintenance tasks, dependency updates
   - `ci`: CI/CD pipeline changes
   - `docs`: Documentation changes
   - `test`: Test additions or modifications
   - `perf`: Performance improvements
   - `style`: Code style/formatting changes
   - `hotfix`: Critical production fixes

7. Based on the changes, commit messages, and file modifications, generate:
   - A merge request **title** in format: `<type>: <ticket> - <description>`
     - Example: `refactor: vc-214 - Migrate to npm Workspaces and Centralize Dependency Management`
     - If no ticket: `<type>: <description>`
   - A comprehensive merge request **description** including:
     - **Summary**: Brief overview of what changed and why
     - **What Changed**: Bullet points of key changes
     - **Why These Changes?**: Benefits and rationale
     - **Testing**: What was tested locally
     - **Breaking Changes**: Note if any (or "None")
     - **Files Changed**: Key files modified

8. Return both the title and description in separate markdown code blocks:

\`\`\`markdown
# Title

[Generated title in format: type: ticket - description]
\`\`\`

\`\`\`markdown
# Description

[Generated description here]
\`\`\`
