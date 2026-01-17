# Code Analysis Framework

Detailed framework for systematic multi-dimensional code analysis.

---

## Analysis Dimensions (Complete)

### Dimension 1: Correctness

**Responsibility**: Does the code do what it's supposed to do?

**Questions to Ask**:

1. **Logic Flow**
   - Does every code path work correctly?
   - Are all branches covered?
   - Do loops terminate?
   - Are conditionals correct?

2. **Edge Cases**
   - Null/undefined values?
   - Empty collections?
   - Boundary values (0, max_int)?
   - Negative numbers when expecting positive?

3. **State Management**
   - Is state initialized?
   - Are state transitions valid?
   - Could parallel operations corrupt state?
   - Are async operations sequenced correctly?

4. **Data Integrity**
   - Could data be lost?
   - Could data be duplicated?
   - Are transactions atomic?
   - Is race condition possible?

**Severity**: CRITICAL (crashes, wrong results) → HIGH (specific bug) → MEDIUM (edge case)

**Checklist**:
- [ ] All branches work correctly
- [ ] Edge cases handled (null, empty, negative)
- [ ] Loops terminate properly
- [ ] State is consistent
- [ ] Async operations are synchronized
- [ ] No data loss risk

---

### Dimension 2: Performance

**Responsibility**: Is the code efficient enough?

**Questions to Ask**:

1. **Algorithm Complexity**
   - What's the Big O (best/average/worst)?
   - Is there a better algorithm?
   - Could we trade space for time?

2. **Memory Usage**
   - Are arrays allocated unnecessarily?
   - Could we stream instead of load all?
   - Are objects being created in loops?

3. **I/O Operations**
   - Database queries: N+1 problem?
   - Network requests: batching possible?
   - Disk reads: could cache help?

4. **Computational Efficiency**
   - String concatenation in loops?
   - Regex compiled once or each time?
   - Unnecessary iterations?

**Severity**: HIGH (slows to crawl) → MEDIUM (noticeable) → LOW (minor)

**Complexity Reference**:
```
O(1)        ← Constant (best)
O(log n)    ← Logarithmic (excellent)
O(n)        ← Linear (good)
O(n log n)  ← Linearithmic (acceptable)
O(n²)       ← Quadratic (concerning)
O(2ⁿ)       ← Exponential (very bad)
```

**Checklist**:
- [ ] Algorithm is optimal or near-optimal
- [ ] No unnecessary allocations in loops
- [ ] Database queries batched
- [ ] Network calls minimized
- [ ] Caching used where appropriate
- [ ] Scales linearly or better

---

### Dimension 3: Maintainability

**Responsibility**: Can someone else understand and modify this?

**Questions to Ask**:

1. **Naming**
   - Variables: descriptive? (not `x`, `temp`, `data`)
   - Functions: clear what they do?
   - Classes: represent clear concepts?
   - Constants: explain the value?

2. **Function Length**
   - Typical: 10-30 lines
   - Max: 50 lines before breaking into functions
   - Too long = doing multiple things

3. **Complexity**
   - How many branches? (should be <5)
   - How many parameters? (should be <4)
   - Nesting depth? (should be <3)
   - Could use early returns?

4. **Comments**
   - Explain WHY, not WHAT
   - Comment non-obvious logic
   - Document assumptions
   - Update comments with code

5. **Structure**
   - Related code together?
   - Consistent patterns?
   - No "magic" values?
   - Single Responsibility?

**Severity**: MEDIUM (hard to understand) → LOW (minor style issue)

**Checklist**:
- [ ] Names are descriptive
- [ ] Functions are focused and short
- [ ] Complexity is reasonable
- [ ] Comments explain WHY
- [ ] Code follows project patterns
- [ ] No magic numbers/strings

---

### Dimension 4: Security

**Responsibility**: Is this code vulnerable to attack?

**Questions to Ask**:

1. **Input Validation**
   - Is user input sanitized?
   - Could injection attacks happen?
   - Is data type validated?
   - Are limits enforced?

2. **Authentication & Authorization**
   - Is user identity verified?
   - Is user permission checked?
   - Could unauthorized access occur?
   - Are credentials stored safely?

3. **Data Protection**
   - Is sensitive data encrypted?
   - Could sensitive data be exposed?
   - Is data encrypted in transit?
   - Is data encrypted at rest?

4. **Dependency Safety**
   - Any known vulnerabilities?
   - Dependencies are updated?
   - Third-party code reviewed?

5. **Error Handling**
   - Do errors expose information?
   - Is logging secure?
   - Could stack traces leak info?

**Severity**: CRITICAL (exploitable) → HIGH (likely issue) → MEDIUM (possible issue)

**OWASP Top 10 Checklist**:
- [ ] A01: Broken Access Control
- [ ] A02: Cryptographic Failures
- [ ] A03: Injection (SQL, NoSQL, Command)
- [ ] A04: Insecure Design
- [ ] A05: Security Misconfiguration
- [ ] A06: Vulnerable Components
- [ ] A07: Authentication Failures
- [ ] A08: Data Integrity Failures
- [ ] A09: Logging Failures
- [ ] A10: SSRF

---

### Dimension 5: Testability

**Responsibility**: Can this code be tested effectively?

**Questions to Ask**:

1. **Purity**
   - Is the function pure (no side effects)?
   - Can we call it with different inputs?
   - Does it return predictable outputs?

2. **Dependencies**
   - Can external dependencies be mocked?
   - Are dependencies injected?
   - Could we isolate this code?

3. **Testable Paths**
   - How many branches to test?
   - Are branches realistic?
   - Could we trigger all paths?

4. **Setup Complexity**
   - How hard to create test data?
   - How many mocks needed?
   - Could we use fixtures?

5. **Coverage**
   - What % of code is tested?
   - Are critical paths tested?
   - Are edge cases tested?

**Severity**: MEDIUM (hard to test) → LOW (could be better)

**Checklist**:
- [ ] Functions are mostly pure
- [ ] Dependencies injectable
- [ ] Can mock external services
- [ ] Test setup is reasonable
- [ ] Critical paths are testable
- [ ] Coverage is adequate (>80%)

---

### Dimension 6: Architecture

**Responsibility**: Is this well-designed?

**Questions to Ask**:

1. **Separation of Concerns**
   - Each module has one reason to change?
   - UI separate from logic?
   - Logic separate from data?

2. **Coupling**
   - Is coupling minimal?
   - Any circular dependencies?
   - Could we swap implementations?

3. **Cohesion**
   - Is related code together?
   - Are concerns grouped?
   - Could we understand one module in isolation?

4. **Patterns**
   - Are established patterns used?
   - Consistency with codebase?
   - Could we extend without modifying?

5. **Scalability**
   - Could this grow to 10x usage?
   - Would performance degrade?
   - Would complexity explode?

**Severity**: HIGH (major design flaw) → MEDIUM (could be better)

**Design Pattern Checklist**:
- [ ] MVC/MVP/MVVM (if applicable)
- [ ] Repository pattern (data access)
- [ ] Dependency injection
- [ ] Factory pattern (object creation)
- [ ] Observer pattern (events)
- [ ] Strategy pattern (behaviors)

---

## Complete Analysis Checklist

### Pre-Review (5 minutes)

- [ ] Understand the PR: What's changing?
- [ ] Read the description: Why these changes?
- [ ] Check related issues: What's the context?
- [ ] Scan file list: How many files? How large?
- [ ] Look for tests: Test coverage?

### Review (30+ minutes)

**For Each File**:
- [ ] Read the whole file first (context)
- [ ] Check imports: Any red flags?
- [ ] Scan for TODOs/FIXMEs: Known issues?

**Correctness (5 min)**:
- [ ] Logic seems correct?
- [ ] Null checks present?
- [ ] Edge cases handled?
- [ ] State consistency?
- [ ] Async issues?

**Performance (3 min)**:
- [ ] Any obvious O(n²) algorithms?
- [ ] Database query N+1 problems?
- [ ] Unnecessary allocations?
- [ ] String concatenation loops?

**Maintainability (3 min)**:
- [ ] Names are clear?
- [ ] Functions are focused?
- [ ] Comments explain WHY?
- [ ] Follows project patterns?
- [ ] Too complex?

**Security (3 min)**:
- [ ] User input validated?
- [ ] SQL injection possible?
- [ ] XSS possible?
- [ ] Credentials exposed?
- [ ] OWASP issues?

**Tests (2 min)**:
- [ ] New tests added?
- [ ] Tests cover changes?
- [ ] Edge cases tested?
- [ ] Tests will pass?

**Architecture (2 min)**:
- [ ] Follows project structure?
- [ ] Single responsibility?
- [ ] Properly decoupled?
- [ ] Uses established patterns?

### Post-Review (5 minutes)

- [ ] Categorize findings by severity
- [ ] Prioritize critical issues
- [ ] Group related comments
- [ ] Draft feedback
- [ ] Be constructive and respectful

---

## Analysis Report Template

### Format 1: Detailed Review

```
## Code Analysis Report

### Summary
- Files reviewed: 3
- Total lines: 450
- Issues found: 8 (1 critical, 3 high, 2 medium, 2 low)

### Critical Issues (Must Fix)
**Issue 1: [Title]**
- File: path/to/file.ts (line 42)
- Description: [What's wrong]
- Impact: [Why it matters]
- Fix:
  ```
  [Suggested code]
  ```

### High Priority Issues (Should Fix)
**Issue 1: [Title]**
- [Details...]

### Medium Priority (Consider Fixing)
**Suggestion 1: [Title]**
- [Details...]

### Architecture Notes
- Good: [What's done well]
- Could improve: [Suggestions]

### Test Coverage
- Coverage: 85% (good)
- Missing: Edge case for negative numbers

### Security Check
✅ No OWASP vulnerabilities detected
```

### Format 2: Quick Review

```
## Quick Code Review

✅ Correctness: Looks good, all branches covered
⚠️ Performance: O(n²) loop on line 42, consider optimization
⚠️ Maintainability: Magic number 300 should be named constant
✅ Security: No vulnerabilities detected
✅ Tests: Good coverage of new feature
✅ Architecture: Follows project patterns

**Recommendation**: Approve with minor fixes
```

### Format 3: Issue by Category

```
## Analysis by Category

### Correctness ✅
- All branches work correctly
- Edge cases handled (null, empty)

### Performance ⚠️
- O(n²) loop on line 42 when O(n) available
  - With 1000 items: 1000ms → Could be 10ms
  - Fix: Use Set instead of array search
  - Effort: 2 lines of code

### Maintainability ✅
- Clear naming conventions
- Well-commented non-obvious logic
- Functions appropriately sized

### Security ✅
- Input validation present
- SQL injection protected (parameterized queries)
- No credential exposure

### Tests ✅
- 92% coverage
- Edge cases tested
- All branches covered

### Architecture ✅
- Follows project structure
- Single Responsibility Principle
- Properly decoupled
```

---

## Example: Complete Analysis

### Code Under Review

```typescript
// File: src/services/userService.ts
export async function getUsersAndPosts(ids: any) {
  let result = {};
  for (let i = 0; i < ids.length; i++) {
    const user = await db.users.find({id: ids[i]});
    const posts = await db.posts.find({userId: ids[i]});
    result += user.name + ":" + posts.length + ",";
  }
  return result;
}
```

### Analysis

#### Correctness ❌
- **CRITICAL**: No null check on `user` or `posts` (crashes if queries return null)
- **HIGH**: Assumes `ids` is array (crashes if undefined)
- **MEDIUM**: `result +=` on string is inefficient

#### Performance ❌
- **HIGH**: N+1 queries (1 query per user, then 1 per user for posts)
  - With 100 users: 200 queries instead of 2
  - Fix: Batch queries using `$in` operator
- **MEDIUM**: String concatenation in loop (creates new string each iteration)
  - Fix: Use array.join() instead

#### Maintainability ❌
- **LOW**: Variable names okay but not great
- **MEDIUM**: No comments explaining what this does
- **LOW**: Magic characters (":", ",") should be documented

#### Security ❌
- **HIGH**: Uses `any` type (violates project TypeScript rule)
- **MEDIUM**: No error handling (errors silently ignored)

#### Tests ❌
- **MEDIUM**: Pure function but hard to mock db
  - Fix: Inject db as parameter

#### Architecture ⚠️
- **MEDIUM**: Tightly coupled to database (hard to test)
- **LOW**: Side effects (modifies result) mixed with computation

### Recommended Fixes

```typescript
// File: src/services/userService.ts
export interface UserWithPostCount {
  name: string;
  postCount: number;
}

export async function getUsersAndPostCounts(
  db: Database,
  userIds: string[]
): Promise<UserWithPostCount[]> {
  // Validate input
  if (!userIds || userIds.length === 0) {
    return [];
  }

  try {
    // Batch query: Get all users at once
    const users = await db.users.find({id: {$in: userIds}});

    // Batch query: Get all posts at once
    const posts = await db.posts.find({userId: {$in: userIds}});

    // Efficient computation using Map for lookup
    const postsByUserId = new Map<string, number>();
    posts.forEach(post => {
      const current = postsByUserId.get(post.userId) || 0;
      postsByUserId.set(post.userId, current + 1);
    });

    // Transform to desired format
    return users.map(user => ({
      name: user.name,
      postCount: postsByUserId.get(user.id) || 0
    }));
  } catch (error) {
    logger.error('Failed to fetch users and posts', {userIds, error});
    throw error;  // Let caller handle
  }
}
```

### Analysis of Fix

✅ **Correctness**: Handles null, empty, and error cases
✅ **Performance**: O(n) instead of O(n²), 2 queries instead of 2n
✅ **Maintainability**: Clear naming, documented intent
✅ **Security**: Proper types, error handling
✅ **Testability**: Dependency injection for database
✅ **Architecture**: Pure function with clear input/output

---

## Practice Example

**Your Turn**: Analyze this code

```python
def process_data(data):
    result = ""
    for item in data:
        result += str(item) + ","
    return result[:-1]
```

**Questions**:
1. What are the correctness issues?
2. What's the performance impact?
3. How would you improve it?
4. What about error handling?

**Solution**: See PATTERNS.md for Python anti-patterns
