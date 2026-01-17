# Code Analyzer

Intelligent code analysis skill for identifying quality issues, performance opportunities, and architectural patterns.

---

## Purpose

Provides structured analysis of code across multiple dimensions: correctness, performance, maintainability, security, and architectural patterns. Used when reviewing code, refactoring, or designing new features.

## Activates On

- code review
- analyze code
- quality check
- performance issues
- refactor
- design patterns
- code smell
- technical debt
- security review
- maintainability

## File Count

4 files, ~950 lines total

## Priority

**HIGH** - Essential for code quality and code review workflows

## Dependencies

**Project context**: Project's coding standards from `.claude/rules/`

**Related skills**:
- TDD Workflow (test-driven development approach)
- Coding Practices (TypeScript standards, no `any`)
- Markdown Linting (documentation quality)

## Coverage

### Core Analysis Dimensions

- **Correctness** - Logic errors, edge cases, off-by-one bugs
- **Performance** - Algorithm efficiency, bottlenecks, memory leaks
- **Maintainability** - Code clarity, naming, documentation
- **Security** - Input validation, injection vulnerabilities, secrets exposure
- **Testability** - Unit test coverage, test isolation, mocking
- **Architecture** - Design patterns, separation of concerns, coupling

### Language Support

- TypeScript/JavaScript
- Python
- Go
- Rust
- Java
- SQL
- Shell/Bash

### Analysis Methods

- **Linting Rules** - Apply to each language's standards
- **Pattern Matching** - Detect common anti-patterns
- **Dependency Analysis** - Identify circular dependencies
- **Complexity Metrics** - McCabe complexity, cognitive complexity
- **Test Coverage** - Identify untested paths
- **Security Scanning** - OWASP Top 10 vulnerabilities
- **Performance Profiling** - Identify bottlenecks

## Key Features

✅ **Multi-dimensional Analysis**: Correctness, performance, maintainability, security
✅ **Pattern Detection**: Identifies code smells and anti-patterns
✅ **Actionable Feedback**: Specific, prioritized recommendations
✅ **Severity Levels**: Critical → High → Medium → Low → Info
✅ **Language Agnostic**: Works with TypeScript, Python, Go, Rust, Java, etc.
✅ **Context-Aware**: Uses project rules and standards

## Files

- **SKILL.md** (450 lines) - Core analysis framework and reference
- **ANALYSIS_FRAMEWORK.md** (250 lines) - Detailed analysis dimensions and checklist
- **PATTERNS.md** (150 lines) - Common patterns and anti-patterns by language
- **README.md** (this file) - Skill metadata

## What You'll Learn

- How to systematically analyze code across multiple dimensions
- Common anti-patterns and code smells in your language
- Security vulnerabilities to watch for (OWASP Top 10)
- Performance optimization opportunities
- How to write effective code review comments
- Architectural patterns for your technology stack

## Quick Reference

### Analysis Severity Levels

1. **CRITICAL** - Breaks code, security vulnerability, data loss risk
2. **HIGH** - Significant bug, major performance issue, important security concern
3. **MEDIUM** - Design flaw, moderate performance impact, code clarity issue
4. **LOW** - Minor inefficiency, style issue, inconsistency
5. **INFO** - Suggestion, learning opportunity, nice-to-have improvement

### Common Activation Triggers

```
"Review this code for issues"
"How can we optimize this?"
"Is this type-safe?"
"What patterns does this use?"
"Check for security vulnerabilities"
"Analyze this for performance"
```

## Workflow

1. **Receive code** → Identify language and context
2. **Apply checklist** → Run through analysis dimensions
3. **Detect patterns** → Match against known anti-patterns
4. **Prioritize** → Rank by severity and impact
5. **Provide feedback** → Actionable, specific recommendations
6. **Suggest fixes** → Reference implementation patterns

## Output Format

### For Code Reviews

```
## Analysis Results

### Critical Issues (1)
- [Issue 1]: Description

### High Priority (3)
- [Issue 1]: Description
- [Issue 2]: Description
- [Issue 3]: Description

### Recommendations (2)
- [Suggestion 1]: Rationale
- [Suggestion 2]: Rationale

### Security Check
✅ No OWASP Top 10 violations found

### Performance Analysis
- Algorithm complexity: O(n²) → Consider O(n log n)
- Memory impact: Moderate
```

### For Architecture Review

```
## Architecture Analysis

### Patterns Detected
- [Pattern 1]: Used correctly ✅
- [Pattern 2]: Opportunity for improvement ⚠️

### Coupling Analysis
- Dependencies: 3 critical paths
- Circular dependencies: None ✅

### Recommendations
1. [Refactor suggestion with rationale]
2. [Architecture improvement with benefits]
```

## Language-Specific Notes

### TypeScript/JavaScript
- Check for `any` type usage (violates coding practices rule)
- Verify null/undefined handling
- Analyze for memory leaks in event listeners/subscriptions
- Check Promise error handling

### Python
- Type hints coverage
- Exception handling specificity
- Generator vs list performance implications
- Async/await correctness

### Go
- Error handling (explicit errors checked)
- Goroutine leak prevention
- Channel synchronization
- Defer semantics

### Rust
- Ownership violations (compiler prevents, but explain)
- Panic vs Result usage
- Lifetime parameter correctness
- Unsafe block necessity

## Last Updated

2026-01-15

---

**Part of**: ai-coding-templates
**Category**: Code Quality & Review
