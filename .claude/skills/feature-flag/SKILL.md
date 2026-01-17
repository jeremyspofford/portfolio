---
name: feature-flag
description: Scaffolds new features with safety flags (CDK infrastructure) and prepares the TDD loop. Use when implementing new features that need feature flag protection. Ensures infrastructure is in place before application logic.
---

# Feature Flag Scaffold

Safety-first feature scaffolding with infrastructure-as-code feature flags.

---

## Quick Start

### Activation Patterns

```markdown
"Create a new feature for user authentication"
"Scaffold feature: dark mode toggle"
"Add feature flag for new payment system"
"/feature cognito authentication"
```

### Protocol Summary

1. **Create Safety Layer** - Add feature flag to infrastructure config
2. **Implement CDK** - Wrap resources in conditional blocks
3. **Application Handoff** - Pass config to application layer
4. **Start TDD** - Begin Red-Green-Verify development loop

---

## Phase 1: The Safety Layer (Infrastructure)

### Step 1: Name the Flag

Generate a clean, namespaced flag key based on the feature:

**Format:** `features.<component>.<action>_enabled`

**Examples:**

| Feature | Flag Key |
| ------- | -------- |
| Cognito Auth | `features.auth.cognito_enabled` |
| Dark Mode | `features.ui.dark_mode_enabled` |
| New API | `features.api.v2_enabled` |
| Payment Gateway | `features.payments.stripe_enabled` |

### Step 2: Update Config Interface

Add the new flag definition to the `EnvironmentConfig` interface:

**File:** `infrastructure/lib/types/environment.ts`

```typescript
export interface EnvironmentConfig {
  // ... existing config ...
  features?: {
    auth?: {
      /** Enable Cognito user pool for authentication */
      cognito_enabled?: boolean;
    };
    // Add your new feature namespace here
  };
}
```

**Requirements:**

- Use TSDoc comment to document the flag purpose
- Use optional properties (`?`) for all flags
- Nest under appropriate feature namespace

### Step 3: Enable in Sandbox

Enable the feature in the sandbox environment only:

**File:** `infrastructure/lib/config/sandbox.ts`

```typescript
export const sandboxConfig: EnvironmentConfig = {
  // ... existing config ...
  features: {
    auth: {
      cognito_enabled: true, // Only enabled in sandbox
    },
  },
};
```

**Critical Rules:**

- Enable in `sandbox.ts` only
- Do NOT enable in `dev.ts`, `stage.ts`, or `prod.ts`
- Production flags default to `undefined`/`false`

---

## Phase 2: CDK Implementation

### Step 1: Locate Stack

Identify the relevant stack file in `infrastructure/lib/stacks/`.

### Step 2: Read Flag

In the stack constructor, read the flag from the config:

```typescript
export class AuthStack extends Stack {
  constructor(scope: Construct, id: string, props: AuthStackProps) {
    super(scope, id, props);

    // Read feature flag
    const isCognitoEnabled = props.config.features?.auth?.cognito_enabled;

    // Conditional resource creation
    if (isCognitoEnabled) {
      this.createCognitoResources();
    }
  }
}
```

### Step 3: Conditional Logic

Wrap new resource creation in conditional blocks:

```typescript
if (isCognitoEnabled) {
  // Create Cognito User Pool
  const userPool = new cognito.UserPool(this, 'UserPool', {
    userPoolName: `${props.config.environment}-user-pool`,
    selfSignUpEnabled: true,
    signInAliases: { email: true },
  });

  // Create User Pool Client
  const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
    userPool,
    authFlows: { userPassword: true, userSrp: true },
  });

  // Export values for application layer
  new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
  new CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
}
```

**Critical Rule:** If the flag is `false`, resources MUST NOT be created.

---

## Phase 3: Application Handoff

### Step 1: Pass Configuration

Pass the feature flag state to the application via environment variables:

```typescript
const lambdaFunction = new lambda.Function(this, 'ApiHandler', {
  // ... other config ...
  environment: {
    COGNITO_ENABLED: isCognitoEnabled ? 'true' : 'false',
    // Pass resource IDs only if feature is enabled
    USER_POOL_ID: isCognitoEnabled ? userPool.userPoolId : '',
    USER_POOL_CLIENT_ID: isCognitoEnabled ? userPoolClient.userPoolClientId : '',
  },
});
```

### Step 2: Handle Missing Resources

Ensure the application handles missing resource IDs gracefully:

```typescript
// In application code
const userPoolId = process.env.USER_POOL_ID;

if (process.env.COGNITO_ENABLED === 'true' && userPoolId) {
  // Use Cognito authentication
  await authenticateWithCognito(userPoolId);
} else {
  // Fall back to existing auth method
  await authenticateWithLegacyAuth();
}
```

---

## Phase 4: TDD Handoff

Once Phases 1-3 are complete, prompt the user:

> "Feature flags and infrastructure shells are ready. Shall we enable this locally and start the TDD loop?"

If the user confirms:

1. Begin the standard **Red-Green-Verify** workflow
2. Write failing tests first
3. Implement minimum code to pass
4. Refactor and verify in browser

---

## Checklist

Before completing feature scaffold:

- [ ] Flag key follows naming convention
- [ ] Interface updated with TSDoc comment
- [ ] Sandbox config enables the flag
- [ ] Other environments DO NOT enable the flag
- [ ] CDK stack reads flag from config
- [ ] Resources wrapped in conditional blocks
- [ ] Environment variables pass flag state to app
- [ ] Application handles missing resources gracefully

---

## Common Mistakes

### Mistake 1: Enabling in Production

```typescript
// WRONG - Don't enable in prod
export const prodConfig: EnvironmentConfig = {
  features: { auth: { cognito_enabled: true } }, // NO!
};

// CORRECT - Leave undefined in prod
export const prodConfig: EnvironmentConfig = {
  // features.auth.cognito_enabled defaults to undefined/false
};
```

### Mistake 2: Not Handling Missing Resources

```typescript
// WRONG - Crashes if resource doesn't exist
const userPoolId = process.env.USER_POOL_ID;
await cognito.getUser(userPoolId); // userPoolId might be ''

// CORRECT - Check flag first
if (process.env.COGNITO_ENABLED === 'true') {
  const userPoolId = process.env.USER_POOL_ID;
  await cognito.getUser(userPoolId);
}
```

### Mistake 3: Creating Resources Unconditionally

```typescript
// WRONG - Resources always created
const userPool = new cognito.UserPool(this, 'UserPool', {});

// CORRECT - Resources only created when flag is true
if (isCognitoEnabled) {
  const userPool = new cognito.UserPool(this, 'UserPool', {});
}
```

---

## Summary

**Key Principle:** No application logic until infrastructure is ready.

**Order of Operations:**

1. Define flag in types
2. Enable in sandbox only
3. Wrap CDK resources in conditionals
4. Pass config to application
5. Handle missing resources gracefully
6. Start TDD workflow

This ensures new features can be safely deployed and rolled back at the infrastructure level.
