---
trigger: always
description: SOLID principles for clean, maintainable code architecture for all agents to adhere to.
---

# SOLID Principles

All AI coding assistants MUST apply SOLID principles when generating, refactoring, or reviewing code. These principles ensure code is maintainable, extensible, and testable.

## Overview

| Principle | Summary |
| --- | --- |
| **S**ingle Responsibility | A class/function should have only one reason to change |
| **O**pen/Closed | Open for extension, closed for modification |
| **L**iskov Substitution | Subtypes must be substitutable for their base types |
| **I**nterface Segregation | Clients shouldn't depend on interfaces they don't use |
| **D**ependency Inversion | Depend on abstractions, not concretions |

---

## S - Single Responsibility Principle (SRP)

**A class, function, or module should have only one reason to change.**

Each unit of code should do one thing well. If you find yourself using "and" to describe what something does, it likely violates SRP.

### SRP Examples

**❌ Incorrect - Multiple responsibilities:**

```typescript
class UserService {
  async createUser(userData: UserInput): Promise<User> {
    // Validation logic
    if (!userData.email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    // Database logic
    const user = await this.db.insert('users', userData);
    
    // Email sending logic
    await sendEmail({
      to: user.email,
      subject: 'Welcome!',
      body: this.generateWelcomeEmail(user),
    });
    
    // Logging logic
    console.log(`User created: ${user.id}`);
    
    return user;
  }
  
  private generateWelcomeEmail(user: User): string {
    return `Hello ${user.name}, welcome to our platform!`;
  }
}
```

**✅ Correct - Single responsibility per class:**

```typescript
// Validation responsibility
class UserValidator {
  validate(userData: UserInput): void {
    if (!userData.email.includes('@')) {
      throw new ValidationError('Invalid email');
    }
  }
}

// Persistence responsibility
class UserRepository {
  async create(userData: UserInput): Promise<User> {
    return this.db.insert('users', userData);
  }
}

// Notification responsibility
class WelcomeEmailService {
  async sendWelcome(user: User): Promise<void> {
    await this.emailClient.send({
      to: user.email,
      subject: 'Welcome!',
      body: `Hello ${user.name}, welcome to our platform!`,
    });
  }
}

// Orchestration responsibility
class UserService {
  constructor(
    private validator: UserValidator,
    private repository: UserRepository,
    private emailService: WelcomeEmailService,
    private logger: Logger,
  ) {}

  async createUser(userData: UserInput): Promise<User> {
    this.validator.validate(userData);
    const user = await this.repository.create(userData);
    await this.emailService.sendWelcome(user);
    this.logger.info(`User created: ${user.id}`);
    return user;
  }
}
```

### SRP Guidelines

- Functions should be 20-30 lines max; if longer, consider splitting
- Classes should have 3-5 public methods max
- If a class needs many dependencies, it's doing too much
- Name things by what they do, not what they contain

---

## O - Open/Closed Principle (OCP)

**Software entities should be open for extension but closed for modification.**

You should be able to add new behavior without changing existing code. Use abstractions, inheritance, or composition.

### OCP Examples

**❌ Incorrect - Requires modification for new types:**

```typescript
class PaymentProcessor {
  processPayment(payment: Payment): void {
    if (payment.type === 'credit_card') {
      this.processCreditCard(payment);
    } else if (payment.type === 'paypal') {
      this.processPayPal(payment);
    } else if (payment.type === 'stripe') {
      // Added new payment type - had to modify this class
      this.processStripe(payment);
    }
  }
  
  private processCreditCard(payment: Payment): void { /* ... */ }
  private processPayPal(payment: Payment): void { /* ... */ }
  private processStripe(payment: Payment): void { /* ... */ }
}
```

**✅ Correct - Extended without modification:**

```typescript
interface PaymentHandler {
  readonly type: string;
  process(payment: Payment): Promise<PaymentResult>;
}

class CreditCardHandler implements PaymentHandler {
  readonly type = 'credit_card';
  async process(payment: Payment): Promise<PaymentResult> {
    // Credit card specific logic
  }
}

class PayPalHandler implements PaymentHandler {
  readonly type = 'paypal';
  async process(payment: Payment): Promise<PaymentResult> {
    // PayPal specific logic
  }
}

// Adding new payment type - no modification to existing code
class StripeHandler implements PaymentHandler {
  readonly type = 'stripe';
  async process(payment: Payment): Promise<PaymentResult> {
    // Stripe specific logic
  }
}

class PaymentProcessor {
  private handlers: Map<string, PaymentHandler>;

  constructor(handlers: PaymentHandler[]) {
    this.handlers = new Map(handlers.map(h => [h.type, h]));
  }

  async processPayment(payment: Payment): Promise<PaymentResult> {
    const handler = this.handlers.get(payment.type);
    if (!handler) {
      throw new Error(`Unknown payment type: ${payment.type}`);
    }
    return handler.process(payment);
  }
}
```

### OCP Guidelines

- Use interfaces/abstract classes for extension points
- Favor composition over inheritance
- Use strategy pattern for interchangeable behaviors
- Use factory pattern for object creation

---

## L - Liskov Substitution Principle (LSP)

**Objects of a superclass should be replaceable with objects of a subclass without breaking the application.**

Derived classes must be usable through the base class interface without the caller knowing the difference.

### LSP Examples

**❌ Incorrect - Subclass changes expected behavior:**

```typescript
class Rectangle {
  constructor(protected width: number, protected height: number) {}

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Breaks LSP - unexpected side effect
  }

  setHeight(height: number): void {
    this.width = height;
    this.height = height; // Breaks LSP - unexpected side effect
  }
}

// This function breaks when passed a Square
function resizeRectangle(rect: Rectangle): void {
  rect.setWidth(10);
  rect.setHeight(5);
  // Expected area: 50
  // Actual area with Square: 25 (height was set last)
}
```

**✅ Correct - Proper abstraction:**

```typescript
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  getArea(): number {
    return this.width * this.height;
  }

  resize(width: number, height: number): Rectangle {
    return new Rectangle(width, height);
  }
}

class Square implements Shape {
  constructor(private side: number) {}

  getArea(): number {
    return this.side * this.side;
  }

  resize(side: number): Square {
    return new Square(side);
  }
}
```

### LSP Guidelines

- Don't override methods to do nothing or throw exceptions
- Preconditions cannot be strengthened in subtypes
- Postconditions cannot be weakened in subtypes
- Favor composition over inheritance when behavior differs
- Use "is-a" test: if it doesn't truly "be" the parent, don't inherit

---

## I - Interface Segregation Principle (ISP)

**Clients should not be forced to depend on interfaces they don't use.**

Many specific interfaces are better than one general-purpose interface.

### ISP Examples

**❌ Incorrect - Fat interface:**

```typescript
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  attendMeeting(): void;
  writeCode(): void;
  reviewCode(): void;
}

class Robot implements Worker {
  work(): void { /* ... */ }
  eat(): void { throw new Error('Robots do not eat'); } // Forced to implement
  sleep(): void { throw new Error('Robots do not sleep'); } // Forced to implement
  attendMeeting(): void { /* ... */ }
  writeCode(): void { /* ... */ }
  reviewCode(): void { throw new Error('Robots cannot review'); } // Forced to implement
}
```

**✅ Correct - Segregated interfaces:**

```typescript
interface Workable {
  work(): void;
}

interface Feedable {
  eat(): void;
}

interface Restable {
  sleep(): void;
}

interface Collaborator {
  attendMeeting(): void;
}

interface Developer {
  writeCode(): void;
  reviewCode(): void;
}

// Human implements all relevant interfaces
class HumanDeveloper implements Workable, Feedable, Restable, Collaborator, Developer {
  work(): void { /* ... */ }
  eat(): void { /* ... */ }
  sleep(): void { /* ... */ }
  attendMeeting(): void { /* ... */ }
  writeCode(): void { /* ... */ }
  reviewCode(): void { /* ... */ }
}

// Robot only implements what it can do
class RobotWorker implements Workable, Collaborator {
  work(): void { /* ... */ }
  attendMeeting(): void { /* ... */ }
}
```

### ISP Guidelines

- Keep interfaces small and focused (3-5 methods max)
- Split interfaces by client needs
- Use interface composition: `interface A extends B, C {}`
- Avoid "god" interfaces with many unrelated methods

---

## D - Dependency Inversion Principle (DIP)

**High-level modules should not depend on low-level modules. Both should depend on abstractions.**

Depend on interfaces, not concrete implementations.

### DIP Examples

**❌ Incorrect - Direct dependency on concrete class:**

```typescript
class MySQLDatabase {
  query(sql: string): Promise<unknown[]> {
    // MySQL specific implementation
  }
}

class UserRepository {
  private database: MySQLDatabase;

  constructor() {
    this.database = new MySQLDatabase(); // Tight coupling
  }

  async findById(id: string): Promise<User | null> {
    const results = await this.database.query(`SELECT * FROM users WHERE id = '${id}'`);
    return results[0] as User;
  }
}
```

**✅ Correct - Dependency on abstraction:**

```typescript
interface Database {
  query<T>(sql: string): Promise<T[]>;
}

interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

class SQLUserRepository implements UserRepository {
  constructor(private database: Database) {} // Injected abstraction

  async findById(id: string): Promise<User | null> {
    const results = await this.database.query<User>(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
    return results[0] ?? null;
  }

  async save(user: User): Promise<void> {
    await this.database.query(
      `INSERT INTO users (id, name, email) VALUES ($1, $2, $3)`,
      [user.id, user.name, user.email]
    );
  }
}

// Easy to swap implementations
class MySQLDatabase implements Database { /* ... */ }
class PostgresDatabase implements Database { /* ... */ }
class InMemoryDatabase implements Database { /* ... */ } // For testing
```

### DIP Guidelines

- Use constructor injection for dependencies
- Define interfaces in the same module as the high-level code
- Use dependency injection containers for complex applications
- Abstractions should be owned by high-level modules
- Makes testing easy with mock implementations

---

## Applying SOLID in This Codebase

### When Creating New Code

1. **Before writing**: Consider which SOLID principles apply
2. **During writing**: Keep functions small, use interfaces
3. **After writing**: Review for violations, refactor if needed

### When Refactoring

1. Identify the largest/most complex classes first
2. Extract responsibilities into separate classes
3. Introduce interfaces for dependencies
4. Use composition to combine behaviors

### Code Review Checklist

- [ ] Does each class/function have a single responsibility?
- [ ] Can new behavior be added without modifying existing code?
- [ ] Are derived classes truly substitutable for their parents?
- [ ] Are interfaces focused and minimal?
- [ ] Are dependencies injected as abstractions?

---

## Integration with AI Assistants

All AI coding assistants (Cursor, Claude, Anthropic, Gemini) MUST:

- **Apply SOLID principles by default** when generating new code
- **Suggest refactoring** when reviewing code that violates SOLID
- **Explain which principle** is being applied when making architectural decisions
- **Prefer small, focused classes** over large, monolithic ones
- **Use dependency injection** for all service dependencies
- **Create interfaces** for any dependency that could have multiple implementations
- **Favor composition over inheritance** unless there's a clear "is-a" relationship
