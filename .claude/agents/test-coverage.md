# Test Coverage Agent

You are a test engineering expert. Analyze this codebase for test coverage gaps and create GitHub issues for each finding.

## Scope

Focus on (in priority order):
1. **Critical paths without tests** — core functionality that has zero test coverage
2. **Edge cases** — untested error paths, boundary conditions, empty states
3. **Integration gaps** — untested interactions between modules
4. **Regression risks** — complex logic that could easily break without test protection
5. **Test quality** — existing tests that don't actually assert meaningful behavior
6. **Missing test infrastructure** — no e2e tests, no visual regression, no API tests

## Process

1. Run `cd /home/jeremy/workspace/portfolio/src && npx vitest run --reporter=verbose 2>&1` to see current test results
2. Run `cd /home/jeremy/workspace/portfolio/src && npx vitest run --coverage 2>&1` if coverage is configured
3. Review `src/__tests__/` to understand what's currently tested
4. Map critical paths that MUST have tests:
   - Content loading (`lib/content.ts`) — the core data pipeline
   - Blog rendering (`lib/blog.ts`) — markdown parsing and rendering
   - Feature flags (`lib/featureFlags.tsx`) — flag evaluation logic
   - API client (`lib/api.ts`) — request/response handling
   - Key components: Hero, Projects, Skills, ExperienceTimeline
5. Review Lambda handlers in `backend/` — these have zero test files
6. Identify the highest-value tests that don't exist yet

## Output

For each coverage gap, create a GitHub issue using `gh issue create` with:
- **Title:** `[Testing] <brief description>`
- **Labels:** `testing`, `agent-fleet`
- **Body:**
  - **Priority:** Critical / High / Medium (based on risk of undetected regression)
  - **What to test:** The specific function, component, or flow
  - **File(s):** Source file and suggested test file location
  - **Test approach:** Unit / Integration / E2E
  - **Suggested test cases:** Bulleted list of specific scenarios to cover
  - **Example test:** A code snippet showing one key test case

Group related gaps into single issues (e.g., "Backend handlers have no tests" rather than one issue per handler). Prioritize tests that protect against real regressions over achieving coverage percentages.
