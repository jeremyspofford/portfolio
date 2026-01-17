# Common Code Patterns & Anti-Patterns

Language-specific patterns and anti-patterns organized by type.

---

## TypeScript/JavaScript

### Type Safety Anti-Patterns

**Anti-Pattern 1: Using `any`**
```typescript
// WRONG - Violates project rule
function process(data: any) {
  return data.value + data.count;  // Could be undefined!
}

// RIGHT
interface ProcessData {
  value: number;
  count: number;
}
function process(data: ProcessData): number {
  return data.value + data.count;
}
```

**Anti-Pattern 2: Optional chaining without fallback**
```typescript
// WRONG - Returns undefined, caller might not handle it
function getName(user: {name?: string}) {
  return user.name;  // Might be undefined
}

// RIGHT - Explicit or provides default
function getName(user: {name?: string}): string {
  return user.name ?? 'Unknown';
}
```

**Anti-Pattern 3: Type assertion abuse**
```typescript
// WRONG - Hiding type errors
const user = data as User;  // Assumes data is User, no validation!

// RIGHT - Actually check the type
function isUser(data: unknown): data is User {
  return typeof data === 'object' && 'name' in data && 'email' in data;
}
const user = isUser(data) ? data : null;
```

### Async/Await Anti-Patterns

**Anti-Pattern 1: Fire and forget**
```typescript
// WRONG - Errors silently disappear
function loadData() {
  fetchData().then(processData);  // What if fetchData fails?
}

// RIGHT - Handle errors
async function loadData() {
  try {
    const data = await fetchData();
    await processData(data);
  } catch (error) {
    logger.error('Failed to load data', error);
    handleError(error);
  }
}
```

**Anti-Pattern 2: Parallel operations run sequentially**
```typescript
// WRONG - Takes 2+ seconds
async function getMultipleUsers(ids: string[]) {
  const users = [];
  for (const id of ids) {
    users.push(await fetchUser(id));  // Waits for each one!
  }
  return users;
}

// RIGHT - Takes <1 second
async function getMultipleUsers(ids: string[]) {
  return Promise.all(ids.map(fetchUser));  // All in parallel!
}
```

**Anti-Pattern 3: Catching errors too broadly**
```typescript
// WRONG - Hides programming errors
async function getData() {
  try {
    return await fetch('/api/data').then(r => r.json());
  } catch (error) {
    console.log('Error');  // What error? No logging details!
  }
}

// RIGHT - Specific error handling
async function getData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      logger.error('Network error', error);
    } else if (error instanceof SyntaxError) {
      logger.error('Invalid JSON response', error);
    } else {
      logger.error('Unexpected error', error);
    }
    throw error;  // Re-throw for caller
  }
}
```

### Performance Anti-Patterns

**Anti-Pattern 1: String concatenation in loops**
```typescript
// WRONG - Creates 1000 intermediate strings
let result = "";
for (let i = 0; i < 1000; i++) {
  result += i + ",";  // New string object each time!
}

// RIGHT - Single join operation
const result = Array.from({length: 1000}, (_, i) => i).join(",");
```

**Anti-Pattern 2: Array.indexOf in loop**
```typescript
// WRONG - O(n²) algorithm
function findDuplicates(arr) {
  return arr.filter(item => arr.indexOf(item) > -1);
}

// RIGHT - O(n) with Set
function findDuplicates(arr) {
  const seen = new Set();
  return arr.filter(item => {
    const isDuplicate = seen.has(item);
    seen.add(item);
    return isDuplicate;
  });
}
```

**Anti-Pattern 3: N+1 queries**
```typescript
// WRONG - 101 database queries
const users = await db.users.find();  // 1 query
for (const user of users) {
  user.posts = await db.posts.find({userId: user.id});  // 100 queries
}

// RIGHT - 2 queries using batch
const users = await db.users.find();  // 1 query
const allPosts = await db.posts.find({
  userId: {$in: users.map(u => u.id)}  // 1 query for all!
});
const postsByUserId = new Map();
allPosts.forEach(post => {
  if (!postsByUserId.has(post.userId)) {
    postsByUserId.set(post.userId, []);
  }
  postsByUserId.get(post.userId).push(post);
});
users.forEach(user => {
  user.posts = postsByUserId.get(user.id) || [];
});
```

---

## Python

### Type Safety Anti-Patterns

**Anti-Pattern 1: Missing type hints**
```python
# WRONG - No type information
def add_numbers(a, b):
    return a + b  # Works with anything!

# RIGHT - Clear types
def add_numbers(a: int, b: int) -> int:
    return a + b
```

**Anti-Pattern 2: Bare except**
```python
# WRONG - Catches everything including system exceptions
try:
    dangerous_operation()
except:  # Catches KeyboardInterrupt, SystemExit!
    pass

# RIGHT - Catch specific exceptions
try:
    dangerous_operation()
except (ValueError, TypeError, IOError) as e:
    logger.error(f"Operation failed: {e}")
except Exception as e:
    logger.exception("Unexpected error", exc_info=True)
```

**Anti-Pattern 3: Mutable default arguments**
```python
# WRONG - Same list used for all calls!
def add_item(item, items=[]):
    items.append(item)
    return items

add_item(1)       # [1]
add_item(2)       # [1, 2] ← Same list!
add_item(3, [])   # [3] ← Only when explicit

# RIGHT - Use None as sentinel
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### Error Handling Anti-Patterns

**Anti-Pattern 1: Not closing resources**
```python
# WRONG - File never closed if error occurs
f = open('file.txt')
data = f.read()
f.close()  # Might not reach here!

# RIGHT - Guaranteed cleanup
with open('file.txt') as f:
    data = f.read()  # File auto-closed
```

**Anti-Pattern 2: Swallowing exceptions**
```python
# WRONG - Errors invisible
try:
    result = int(user_input)
except ValueError:
    pass  # Silent failure!

# RIGHT - Log or handle properly
try:
    result = int(user_input)
except ValueError as e:
    logger.warning(f"Invalid input: {user_input}, error: {e}")
    result = 0  # Default value
```

### Performance Anti-Patterns

**Anti-Pattern 1: String concatenation in loops**
```python
# WRONG - Creates new string each iteration
result = ""
for i in range(1000):
    result += str(i) + ","  # Inefficient!

# RIGHT - Use join
result = ",".join(str(i) for i in range(1000))
```

**Anti-Pattern 2: List comprehension vs generator**
```python
# WRONG - Loads entire list into memory
large_list = [process(x) for x in huge_dataset]  # Could be GB!

# RIGHT - Use generator for memory efficiency
large_gen = (process(x) for x in huge_dataset)  # Lazy evaluation
for item in large_gen:  # Processes one at a time
    handle(item)
```

**Anti-Pattern 3: Not using sets for membership tests**
```python
# WRONG - O(n) lookup
valid_ids = [1, 2, 3, 4, 5]
if user_id in valid_ids:  # Scans entire list!
    pass

# RIGHT - O(1) lookup
valid_ids = {1, 2, 3, 4, 5}
if user_id in valid_ids:  # Hash table lookup!
    pass
```

---

## Go

### Error Handling Anti-Patterns

**Anti-Pattern 1: Ignoring errors**
```go
// WRONG - Error silently ignored
file, _ := os.Open("file.txt")
defer file.Close()

// RIGHT - Handle error properly
file, err := os.Open("file.txt")
if err != nil {
    log.Fatalf("Cannot open file: %v", err)
}
defer file.Close()
```

**Anti-Pattern 2: Not wrapping errors with context**
```go
// WRONG - Loses context
data, err := fetchData()
if err != nil {
    return err  // What was being fetched?
}

// RIGHT - Add context
data, err := fetchData()
if err != nil {
    return fmt.Errorf("failed to fetch user data for ID %s: %w", userID, err)
}
```

### Concurrency Anti-Patterns

**Anti-Pattern 1: Goroutine leaks**
```go
// WRONG - Goroutines never finish
for _, url := range urls {
    go func(u string) {
        fetch(u)  // What if this blocks forever?
    }(url)
}
// Function returns, goroutines still running!

// RIGHT - Wait for all goroutines
var wg sync.WaitGroup
for _, url := range urls {
    wg.Add(1)
    go func(u string) {
        defer wg.Done()
        fetch(u)
    }(url)
}
wg.Wait()  // Wait for all to complete
```

**Anti-Pattern 2: Channel deadlock**
```go
// WRONG - Deadlock! Sender and receiver never synchronize
ch := make(chan int)
ch <- 42  // Blocks forever waiting for receiver

// RIGHT - Unbuffered requires receiver or goroutine
ch := make(chan int)
go func() {
    ch <- 42  // Runs in goroutine
}()
value := <-ch  // Receives in main

// OR - Use buffered channel
ch := make(chan int, 1)
ch <- 42  // Doesn't block, buffer holds it
value := <-ch
```

### Performance Anti-Patterns

**Anti-Pattern 1: String concatenation in loops**
```go
// WRONG - Allocates new string each time
result := ""
for i := 0; i < 1000; i++) {
    result += fmt.Sprintf("%d,", i)  // Inefficient!
}

// RIGHT - Use strings.Builder
var builder strings.Builder
for i := 0; i < 1000; i++ {
    fmt.Fprintf(&builder, "%d,", i)
}
result := builder.String()
```

**Anti-Pattern 2: Copying large structs**
```go
// WRONG - Copies entire struct
type User struct {
    ID    int
    Name  string
    // ... 50 more fields
    Data  []byte  // Large field!
}

func process(user User) {  // Entire copy passed!
    // ...
}

// RIGHT - Pass pointer
func process(user *User) {  // Just passes pointer
    // ...
}
```

---

## Rust

### Ownership Anti-Patterns

**Anti-Pattern 1: Unnecessary cloning**
```rust
// WRONG - Clones unnecessarily
fn process(data: Vec<String>) {
    let copy = data.clone();  // Expensive clone!
    // use both data and copy
}

// RIGHT - Use references
fn process(data: &Vec<String>) {
    // Borrow instead of owning
}
```

**Anti-Pattern 2: Unwrapping errors**
```rust
// WRONG - Panics on error
let file = File::open("data.txt").unwrap();  // Crashes if not found!

// RIGHT - Handle errors
let file = match File::open("data.txt") {
    Ok(f) => f,
    Err(e) => {
        eprintln!("Cannot open file: {}", e);
        return Err(e.into());
    }
};

// OR - Use ? operator
let file = File::open("data.txt")?;  // Returns error to caller
```

### Performance Anti-Patterns

**Anti-Pattern 1: Unnecessary allocations**
```rust
// WRONG - Allocates String when slice suffices
fn process(data: String) -> String {  // Takes ownership
    data
}

// RIGHT - Use references
fn process(data: &str) -> &str {  // Borrows
    data
}
```

---

## SQL

### Query Anti-Patterns

**Anti-Pattern 1: N+1 queries**
```sql
-- WRONG - Runs N+1 queries
SELECT * FROM users;
-- Then in application loop:
SELECT * FROM posts WHERE user_id = ?;  -- Once per user!

-- RIGHT - Use JOIN
SELECT u.*, p.*
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;
```

**Anti-Pattern 2: SELECT ***
```sql
-- WRONG - Transfers unnecessary data
SELECT * FROM users;  -- Gets all columns

-- RIGHT - Only needed columns
SELECT id, name, email FROM users;  -- Smaller, faster
```

**Anti-Pattern 3: SQL injection**
```sql
-- WRONG - Vulnerable
query = `SELECT * FROM users WHERE name = '${userName}'`;
// If userName = "'; DROP TABLE users; --"
// Becomes: SELECT * FROM users WHERE name = ''; DROP TABLE users; --'

-- RIGHT - Parameterized query
query = "SELECT * FROM users WHERE name = ?";
execute(query, [userName]);  // Escapes special characters
```

---

## General Patterns

### Testing Anti-Patterns

**Anti-Pattern 1: Tests that can't fail**
```javascript
// WRONG - Test always passes
test('user creation', () => {
  const user = createUser({name: 'John'});
  expect(user).toBeDefined();  // Always true!
});

// RIGHT - Test actual behavior
test('user creation', () => {
  const user = createUser({name: 'John'});
  expect(user.name).toBe('John');
  expect(user.id).toBeDefined();
  expect(user.createdAt).toBeCloseTo(Date.now(), -3);
});
```

**Anti-Pattern 2: Brittle tests**
```javascript
// WRONG - Implementation-dependent
test('sorting', () => {
  const result = sort([3, 1, 2]);
  // Depends on algorithm details
  expect(result.join(',')).toBe('1,2,3');
});

// RIGHT - Behavior-dependent
test('sorting', () => {
  const result = sort([3, 1, 2]);
  expect(result).toEqual(expect.arrayContaining([1, 2, 3]));
});
```

### Naming Anti-Patterns

**Anti-Pattern 1: Vague names**
```typescript
// WRONG
const x = data.filter(d => d > 10);
const process = (v) => v * 2;
let temp = 0;

// RIGHT
const largeValues = data.filter(value => value > 10);
const doubleValue = (value) => value * 2;
let temperatureCelsius = 0;
```

**Anti-Pattern 2: Misleading names**
```typescript
// WRONG - Name doesn't match behavior
function getUserEmail(userId) {
  const user = db.users.find(userId);
  return user.profile.picture;  // Not returning email!
}

// RIGHT - Name matches behavior
function getUserProfilePicture(userId) {
  const user = db.users.find(userId);
  return user.profile.picture;
}
```

---

## Pattern Selection Guide

**When you see...**
- Magic numbers → Extract to named constant
- Nested loops → Consider Set or Map for O(n)
- String concatenation in loop → Use join()
- Fire-and-forget async → Add error handling
- `any` type → Use `interface` or union type
- Bare `except:` → Catch specific exceptions
- Mutable defaults → Use None as sentinel
- Multiple concerns in one function → Split into functions
- Tight coupling → Use dependency injection
- No error messages → Add context to errors

---

## Summary

**Most Common Anti-Patterns**:
1. Type safety issues (any, no type hints)
2. Error handling (ignoring, swallowing)
3. Performance (N+1, concatenation loops)
4. Async issues (fire-and-forget, race conditions)
5. Testing (brittle tests, poor naming)

**When Reviewing**:
- Check for language-specific anti-patterns first
- Apply correctness checks
- Look for performance concerns
- Verify security practices
- Ensure testability

**When Writing**:
- Know your language's anti-patterns
- Follow established patterns in codebase
- Write tests as you go
- Review your own code first
- Ask for feedback on uncertain parts
