# Playwright Testing API Reference

This document provides a comprehensive reference for the Playwright testing capabilities provided by the `playwright-skill`.

## Table of Contents

- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
- [Page Interacting](#page-interacting)
- [Selectors](#selectors)
- [Assertions](#assertions)
- [Page Object Model (POM)](#page-object-model-pom)
- [Network and API Testing](#network-and-api-testing)
- [Authentication and Session Management](#authentication-and-session-management)
- [Visual Testing](#visual-testing)
- [Mobile Testing](#mobile-testing)
- [Debugging](#debugging)

## Getting Started

To use this skill, provided automation scripts should be written to `/tmp/` and executed via the `run.js` helper.

```javascript
const { test, expect } = require('@playwright/test');
const { runTest } = require('./lib/helpers');

runTest(async (page) => {
  await page.goto('https://example.com');
  // Your test logic here
});
```

## Core Concepts

Understanding Playwright's core concepts is essential for writing robust tests.

### Browsers, Contexts, and Pages

Playwright starts with a **Browser** (Chromium, Firefox, or WebKit). Each browser can have multiple **BrowserContexts**, which are isolated login sessions. Each context can have multiple **Pages**.

## Page Interacting

Common actions you can perform on a page:

```javascript
await page.goto('https://example.com');
await page.click('button');
await page.fill('input', 'text');
await page.selectOption('select', 'value');
await page.check('input[type="checkbox"]');
```

## Selectors

Playwright supports multiple selector engines:

- **CSS**: `page.locator('div > span')`
- **Text**: `page.locator('text=Login')`
- **XPath**: `page.locator('//button')`
- **React/Vue**: `page.locator('_react=Button')`

## Assertions

Playwright provides web-first assertions that automatically retry until the condition is met.

```javascript
await expect(page).toHaveTitle(/Example/);
await expect(locator).toBeVisible();
await expect(locator).toHaveText('Welcome');
```

## Page Object Model (POM)

POM is a design pattern that creates an abstraction layer for web pages.

```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button');
  }

  async login(user, pass) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}
```

## Network and API Testing

Playwright can intercept and modify network traffic.

```javascript
await page.route('**/api/data', route => route.fulfill({
  status: 200,
  body: JSON.stringify({ key: 'value' })
}));
```

## Authentication and Session Management

For authenticated flows, you can save and reuse authentication state.

```javascript
// Save auth state
await context.storageState({ path: 'auth.json' });

// Use auth state
const context = await browser.newContext({ storageState: 'auth.json' });
```

## Visual Testing

Playwright can perform visual regression testing using screenshots.

```javascript
await expect(page).toHaveScreenshot('landing-page.png');
```

## Mobile Testing

Playwright can emulate mobile devices.

```javascript
const iPhone = devices['iPhone 12'];
const context = await browser.newContext({ ...iPhone });
```

## Debugging

You can use the Playwright Inspector for debugging.

```bash
PWDEBUG=1 npx playwright test
```
