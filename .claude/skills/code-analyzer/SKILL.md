---
name: code-analyzer
description: Comprehensive code analysis for quality, performance, security, and architectural patterns. Use when reviewing code, refactoring, or analyzing design decisions. Provides structured analysis across correctness, performance, maintainability, security, and testability dimensions with actionable recommendations.
---

# Code Analyzer

Master guide for systematic code analysis and improvement recommendations.

---

## Quick Start

### Activation Patterns

**Code Review:**
```
"Review this TypeScript for issues"
"Check this Python code for bugs"
"Code review: [code snippet]"
```

**Architecture:**
```
"Analyze the design of this"
"What patterns are used here?"
"Is this maintainable?"
```

**Performance:**
```
"This is slow, why?"
"Optimize this function"
"Performance analysis of this"
```

**Security:**
```
"Check this for vulnerabilities"
"Is this secure?"
"Security review"
```

### Analysis in 30 Seconds

1. **Identify**: Language, context, purpose
2. **Scan**: Critical issues (OWASP, crashes, data loss)
3. **Check**: Performance, maintainability, testability
4. **Report**: Issues by severity → Recommendations
5. **Suggest**: Specific fixes with patterns

---

## Analysis Framework

### Dimension 1: Correctness

**What we check**: Does the code do what it's supposed to?

**Severity**: CRITICAL → HIGH

**Questions**:
- Does the logic handle all cases?
- Are edge cases covered (null, empty, negative)?
- Off-by-one errors?
- Boundary conditions?
- State consistency?
- Race conditions (async code)?

**Example Issues**:
```typescript
// CRITICAL: Infinite loop
while (i < 10) {
  process(i);  // i never incremented!
}

// HIGH: Missing null check
const value = obj.prop.nested;  // What if obj is null?

// MEDIUM: Edge case not handled
function divide(a, b) {
  return a / b;  // What if b === 0?
}

// LOW: Inefficient but correct
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length; j++) {
    if (arr[i] === arr[j]) {...}  // n² when could be n
  }
}
```

**How to fix**:
- Add null/undefined checks
- Handle all branches
- Add bounds checking
- Cover edge cases in tests

### Dimension 2: Performance

**What we check**: Is the code efficient?

**Severity**: HIGH → MEDIUM

**Questions**:
- Algorithm complexity (best/average/worst case)?
- Memory usage (arrays allocated unnecessarily)?
- Unnecessary loops or iterations?
- Database queries (N+1 problem)?
- Network requests (batch vs individual)?
- String concatenation in loops?
- Blocking operations?

**Example Issues**:
```typescript
// HIGH: O(n²) when O(n log n) available
function findDuplicates(arr) {
  return arr.filter(item => arr.indexOf(item) > -1);
  // arr.indexOf searches entire array - called n times!
}

// MEDIUM: String concatenation in loop
let result = "";
for (let i = 0; i < 10000; i++) {
  result += i;  // Creates new string each iteration
}

// MEDIUM: N+1 database query
const users = await db.users.find();  // 1 query
for (const user of users) {
  const posts = await db.posts.find({userId: user.id});  // N queries!
}

// LOW: Premature optimization
const CACHE_VERSION = Math.random();  // Recalculated on every call
```

**How to fix**:
```typescript
// Fix 1: Use Set for O(n)
function findDuplicates(arr) {
  const seen = new Set();
  return arr.filter(item => {
    if (seen.has(item)) return true;
    seen.add(item);
    return false;
  });
}

// Fix 2: Use array join
const result = [0,1,2,...9999].join("");

// Fix 3: Batch queries
const users = await db.users.find();
const allPosts = await db.posts.find({userId: {$in: users.map(u => u.id)}});
```

**Performance Metrics**:
- O(1) ← ← ← Best
- O(log n)
- O(n)
- O(n log n) ← Reasonable
- O(n²) ← Problem area
- O(2ⁿ) ← Exponential - avoid!

### Dimension 3: Maintainability

**What we check**: Can others (or future you) understand and modify this?

**Severity**: MEDIUM → LOW

**Questions**:
- Variable names: descriptive?
- Function length: too long (>50 lines)?
- Complexity: too many branches?
- Comments: explain WHY, not WHAT?
- Magic numbers or strings?
- DRY principle violated?
- Single responsibility?
- Consistent with project standards?

**Example Issues**:
```typescript
// LOW: Vague variable names
const x = data.map(d => d * 2);  // What is d? What does x represent?

// MEDIUM: Too long function (150 lines doing 5 things)
function processUserData(user) {
  // Validation (40 lines)
  // Transformation (50 lines)
  // Database update (30 lines)
  // Email notification (20 lines)
  // Logging (10 lines)
}

// MEDIUM: Magic number
const delay = 300;  // Why 300? What does it mean?

// LOW: Comments state obvious
let i = 0;  // Increment i
i++;

// MEDIUM: Project uses interfaces, this uses any (violates standards)
function process(data: any) {
  return data.value;
}
```

**How to fix**:
```typescript
// Fix 1: Descriptive names
const doubledNumbers = numbers.map(num => num * 2);

// Fix 2: Break into functions
async function processUserData(user) {
  const validated = validateUserData(user);
  const transformed = transformUserData(validated);
  const saved = await saveToDatabase(transformed);
  await notifyUser(saved);
  logProcessing(saved);
  return saved;
}

// Fix 3: Named constants
const TOAST_NOTIFICATION_DELAY_MS = 300;

// Fix 4: Better comments (explain WHY)
// Store pagination position as offset instead of page number
// to handle updates that shift items during loading
const paginationOffset = 300;

// Fix 5: Match project standards
function process(data: ProcessableData): ProcessedResult {
  return data.value;
}
```

### Dimension 4: Security

**What we check**: Is the code vulnerable to attack?

**Severity**: CRITICAL → MEDIUM

**OWASP Top 10 to Watch**:

1. **Injection** (SQL, Command, NoSQL)
   ```typescript
   // CRITICAL: SQL Injection
   const query = `SELECT * FROM users WHERE id = ${userId}`;

   // SAFE: Parameterized query
   const query = "SELECT * FROM users WHERE id = ?";
   db.query(query, [userId]);
   ```

2. **Broken Authentication**
   ```typescript
   // CRITICAL: Password in plaintext, stored in client
   localStorage.setItem('password', userPassword);

   // SAFE: Only store session token, hash password server-side
   localStorage.setItem('sessionToken', token);
   ```

3. **Sensitive Data Exposure**
   ```typescript
   // CRITICAL: API key in code
   const API_KEY = "sk-1234567890";

   // SAFE: Load from environment
   const API_KEY = process.env.API_KEY;
   ```

4. **XML External Entities (XXE)**
   ```typescript
   // CRITICAL: Parser allows external entities
   const xml = parseXml(userInput, {resolveExternalEntities: true});

   // SAFE: Disable external entities
   const xml = parseXml(userInput, {resolveExternalEntities: false});
   ```

5. **Broken Access Control**
   ```typescript
   // CRITICAL: Trusts client-provided user ID
   app.get('/user/:id', (req, res) => {
     const user = db.users.findById(req.params.id);
     res.json(user);
   });

   // SAFE: Check authenticated user matches requested ID
   app.get('/user/:id', (req, res) => {
     if (req.user.id !== req.params.id) return res.status(403).send();
     const user = db.users.findById(req.params.id);
     res.json(user);
   });
   ```

6. **Security Misconfiguration**
   - Debug mode enabled in production
   - Unnecessary services exposed
   - Default credentials
   - Missing security headers

7. **Cross-Site Scripting (XSS)**
   ```typescript
   // CRITICAL: Unescaped user input in HTML
   res.send(`<div>${userInput}</div>`);

   // SAFE: Escape or use templating
   res.send(`<div>${escapeHtml(userInput)}</div>`);
   ```

8. **Insecure Deserialization**
   ```typescript
   // CRITICAL: Untrusted pickle/serialize data
   const obj = pickle.loads(userData);

   // SAFE: Use JSON only, validate structure
   const obj = JSON.parse(userData);
   validateObjectShape(obj);
   ```

9. **Using Components with Known Vulnerabilities**
   - Check `npm audit` output
   - Keep dependencies updated
   - Use tools like Snyk

10. **Insufficient Logging & Monitoring**
    - Log security events (failed auth, privilege escalation)
    - Monitor error rates
    - Set up alerts for suspicious activity

### Dimension 5: Testability

**What we check**: Can this code be tested effectively?

**Severity**: MEDIUM → LOW

**Questions**:
- Are functions pure or dependent on side effects?
- Can external dependencies be mocked?
- Does it follow TDD patterns?
- What's the test coverage?
- Are edge cases testable?
- Is setup complex?

**Example Issues**:
```typescript
// LOW: Hard to test (depends on global state)
function getUser() {
  return globalDatabase.getUser(currentUserId);  // Where do these come from?
}

// BETTER: Dependency injection
function getUser(db, userId) {
  return db.getUser(userId);
}

// Test: Can now pass mock db
const mockDb = {getUser: jest.fn()};
getUser(mockDb, 123);

// MEDIUM: Async code without error handling
async function fetchData(url) {
  return fetch(url).then(r => r.json());  // What if network fails?
}

// BETTER: Explicit error handling
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    logger.error('Failed to fetch', {url, error});
    throw error;
  }
}
```

### Dimension 6: Architecture

**What we check**: Is this well-designed?

**Severity**: HIGH → MEDIUM

**Questions**:
- Single Responsibility Principle?
- Coupling between modules?
- Cohesion (related functionality together)?
- Design patterns applied correctly?
- Separation of concerns?
- Testable architecture?
- Extensible without modification?

**Common Patterns**:
- **MVC/MVP** - Separate view from logic
- **Repository** - Abstract data access
- **Dependency Injection** - Loose coupling
- **Factory** - Object creation abstraction
- **Observer** - Event-driven architecture
- **Strategy** - Swap behaviors at runtime

**Example Issues**:
```typescript
// MEDIUM: God object doing everything
class UserService {
  createUser() {}       // Creation
  saveUser() {}         // Persistence
  validateEmail() {}    // Validation
  sendNotification() {} // Notifications
  generateReport() {}   // Reporting
  // 1000+ lines...
}

// BETTER: Separation of concerns
class UserService { createUser() {} }
class UserRepository { saveUser() {} }
class ValidationService { validateEmail() {} }
class NotificationService { sendNotification() {} }
class ReportService { generateReport() {} }

// MEDIUM: Circular dependency
// UserService imports ReportService
// ReportService imports UserService

// BETTER: Use dependency injection
class UserService {
  constructor(private reportService: ReportService) {}
}

class ReportService {
  constructor(private userRepository: UserRepository) {}
}
```

---

## Analysis Checklist

### Before Code Review

- [ ] Read the PR description
- [ ] Understand what's supposed to change
- [ ] Check test coverage
- [ ] Look for TODOs or FIXME comments

### During Review

- [ ] **Correctness**: Run logic in your head
- [ ] **Edge cases**: What could break?
- [ ] **Performance**: Any obvious inefficiencies?
- [ ] **Security**: Any vulnerabilities?
- [ ] **Tests**: Adequate coverage?
- [ ] **Standards**: Follow project rules?
- [ ] **Documentation**: Clear comments?

### After Analysis

- [ ] Categorize by severity
- [ ] Prioritize critical first
- [ ] Group related issues
- [ ] Provide actionable feedback
- [ ] Suggest specific fixes
- [ ] Reference patterns/standards

---

## Severity Definitions

### CRITICAL
- **Code breaks** - Logic error causes crashes or data loss
- **Security vulnerability** - Can be exploited for unauthorized access
- **Type violations** - Violates project's strict typing rules
- **Data corruption** - Can corrupt database or user data

**Example**: Missing null check that causes crash, SQL injection vulnerability

**Response**: Requires fix before merge

### HIGH
- **Significant bug** - Wrong behavior in common cases
- **Major performance issue** - Algorithm is fundamentally inefficient
- **Important security concern** - Could lead to attack vector
- **Violates project patterns** - Doesn't follow established conventions

**Example**: O(n²) loop that kills performance, incomplete error handling

**Response**: Should fix before merge

### MEDIUM
- **Design flaw** - Could cause problems as code evolves
- **Moderate performance impact** - Inefficient but not critical
- **Code clarity issue** - Hard to understand or maintain
- **Missing edge case** - Unlikely but possible failure

**Example**: Magic numbers, unclear variable names, missing edge case handling

**Response**: Consider fixing, not blocking

### LOW
- **Minor inefficiency** - Optimization that saves little
- **Style inconsistency** - Doesn't match project standards
- **Nice-to-have** - Would be better, but works fine
- **Learning opportunity** - Suggests alternative approach

**Example**: Unused variable, style inconsistency

**Response**: Optional improvement

### INFO
- **Informational** - Context or explanation
- **Pattern suggestion** - Alternative approach might work better
- **Learning point** - Interesting implementation choice

**Response**: For awareness

---

## Common Anti-Patterns by Language

### TypeScript/JavaScript

**Anti-Pattern 1: Loose Typing**
```typescript
// WRONG (violates project rule: no `any`)
function process(data: any) {
  return data.value + data.count;  // Could be undefined!
}

// RIGHT
interface Data {
  value: number;
  count: number;
}
function process(data: Data): number {
  return data.value + data.count;
}
```

**Anti-Pattern 2: Unhandled Promises**
```typescript
// WRONG
function getData() {
  fetch('/api/data').then(processData);  // Silently fails if error
}

// RIGHT
async function getData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data', error);
    throw error;  // Let caller handle
  }
}
```

**Anti-Pattern 3: Mutable Global State**
```typescript
// WRONG
let currentUser = null;
function setUser(user) { currentUser = user; }  // Global mutation!
function getUser() { return currentUser; }

// RIGHT
class UserContext {
  private user: User | null = null;
  setUser(user: User) { this.user = user; }
  getUser(): User { return this.user; }
}
```

### Python

**Anti-Pattern 1: Bare Except**
```python
# WRONG
try:
    do_something()
except:  # Catches KeyboardInterrupt, SystemExit too!
    pass

# RIGHT
try:
    do_something()
except (ValueError, TypeError) as e:
    handle_error(e)
except Exception as e:
    logger.exception("Unexpected error", e)
```

**Anti-Pattern 2: Mutable Default Arguments**
```python
# WRONG
def add_item(item, items=[]):  # Same list used for all calls!
    items.append(item)
    return items

# RIGHT
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

**Anti-Pattern 3: Missing Type Hints**
```python
# WRONG (no hints)
def process(data):
    return [x * 2 for x in data]

# RIGHT (with hints)
def process(data: List[int]) -> List[int]:
    return [x * 2 for x in data]
```

### Go

**Anti-Pattern 1: Ignoring Errors**
```go
// WRONG
file, _ := os.Open("file.txt")  // What if file doesn't exist?
defer file.Close()

// RIGHT
file, err := os.Open("file.txt")
if err != nil {
    log.Fatalf("Cannot open file: %v", err)
}
defer file.Close()
```

**Anti-Pattern 2: Goroutine Leaks**
```go
// WRONG
for _, url := range urls {
    go fetch(url)  // Goroutines might not finish!
}

// RIGHT
var wg sync.WaitGroup
for _, url := range urls {
    wg.Add(1)
    go func(u string) {
        defer wg.Done()
        fetch(u)
    }(url)
}
wg.Wait()
```

---

## Reporting Analysis

### Good Code Review Comment

```
**Correctness Issue (HIGH)**: Missing null check on line 42

The `user.profile` could be null/undefined, causing a runtime error:
```typescript
const email = user.profile.email;  // Crashes if profile is null
```

Suggest:
```typescript
const email = user.profile?.email ?? 'unknown@example.com';
```

Or follow project's error handling pattern with try/catch.

---

**Why**: Prevents crashes in production
```

### Bad Code Review Comment

```
"This looks good" (too vague)
"Fix the bugs" (no specifics)
"This is slow" (no context)
```

### Better Code Review Comment

```
Breaks down:
1. What's wrong (specific line)
2. Why it's wrong (consequence)
3. How to fix it (specific suggestion)
4. Why the fix works (rationale)
```

---

## Performance Analysis Template

When analyzing performance:

1. **Identify bottleneck**
   - Algorithm complexity: O(n²)?
   - Database queries: N+1 problem?
   - Network calls: Batch vs individual?

2. **Measure impact**
   - With 1K items: 1s?
   - With 100K items: 100s?
   - Acceptable limit?

3. **Suggest fix**
   - Change algorithm to O(n log n)?
   - Batch queries?
   - Cache results?

4. **Validate improvement**
   - New complexity: O(n log n)
   - Estimated new time: 10ms
   - Trade-off: More memory but faster

---

## Security Analysis Template

When analyzing security:

1. **Identify threat** - What could go wrong?
   - Example: SQL injection via user input

2. **Assess impact** - What happens if exploited?
   - Example: Attacker could read entire database

3. **Check OWASP** - Which category?
   - Example: A03:2021 - Injection

4. **Suggest fix** - How to prevent?
   - Example: Use parameterized queries

5. **Validate** - Is fix complete?
   - Example: All user inputs use queries now

---

## Summary

**Most Important** (check first):
1. **Correctness** - Does it work?
2. **Security** - Is it safe?
3. **Performance** - Is it fast enough?
4. **Testability** - Can it be tested?
5. **Maintainability** - Can others understand it?

**When Giving Feedback**:
- Be specific (reference line numbers)
- Explain why (help them learn)
- Suggest how to fix (be helpful)
- Prioritize by severity (focus effort)
- Be constructive (collaborative tone)

**Remember**: Code review is about improving the code AND helping developers learn.

---

For detailed analysis frameworks, see:
- [ANALYSIS_FRAMEWORK.md](ANALYSIS_FRAMEWORK.md) - Deep dive on each dimension
- [PATTERNS.md](PATTERNS.md) - Language-specific patterns and anti-patterns
