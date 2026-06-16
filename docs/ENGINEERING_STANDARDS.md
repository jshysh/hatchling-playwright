# Engineering Standards

## Purpose

This document defines the engineering standards used throughout the automation framework.

All contributions should follow these guidelines to ensure consistency, maintainability, and reliability.

---

## General Principles

### DRY

Avoid duplicate logic, locators, and workflows.

If the same implementation appears in multiple places, extract it into a reusable component.

---

### Single Responsibility Principle

Each class should have one primary responsibility.

Examples:

- Page Objects manage page interactions
- Builders generate test data
- API Clients communicate with services
- Tests validate behavior

---

### Readability Over Cleverness

Code should be easy to understand and maintain.

Favor clarity over overly complex abstractions.

---

## Page Object Standards

### Locator Strategy

Preferred order:

1. getByRole
2. getByLabel
3. getByTestId
4. CSS selectors

Avoid XPath unless absolutely necessary.

---

### Action-Oriented Methods

Prefer:

```typescript
await loginPage.login(user);
```

Over:

```typescript
await loginPage.enterUsername(user.name);
await loginPage.enterPassword(user.password);
await loginPage.clickLogin();
```

Tests should describe user intent.

---

### Encapsulation

Tests should not interact directly with locators.

Avoid:

```typescript
await page.locator("#submit").click();
```

Prefer:

```typescript
await checkoutPage.submitOrder();
```

---

## Fixture Standards

Prefer fixture-based dependency injection for commonly used Page Objects and shared resources.

Example:

```typescript
test("user login", async ({ loginPage }) => {
  await loginPage.login(user);
});
```

Direct instantiation is acceptable when fixture usage would introduce unnecessary complexity.

---

## Test Standards

### Assertions

Use Playwright web-first assertions.

Preferred:

```typescript
await expect(element).toBeVisible();
```

Avoid:

```typescript
expect(await element.isVisible()).toBe(true);
```

---

### Waits

Avoid fixed delays.

Never use:

```typescript
await page.waitForTimeout(5000);
```

Unless there is a documented technical limitation.

Prefer:

```typescript
await expect(element).toBeVisible();
```

or

```typescript
await page.waitForResponse(...);
```

---

### Test Independence

Tests must be executable independently.

A test should never rely on another test having run first.

---

### Test Data

Avoid hardcoded test data within test files.

Prefer:

- Builders
- Factories
- Shared data fixtures

---

## TypeScript Standards

### Strict Typing

Use explicit types whenever practical.

Avoid:

```typescript
const user: any;
```

Prefer:

```typescript
const user: User;
```

---

### Interfaces

Use interfaces or types for:

- Request models
- Response models
- Configuration objects
- Test data structures

---

## API Testing Standards

### Client Abstraction

Tests should not build raw requests repeatedly.

Prefer:

```typescript
await eventsClient.createEvent(event);
```

Over:

```typescript
await request.post("/events", {
  data: event,
});
```

throughout multiple tests.

---

### Data Builders

Use builders for complex payload generation.

Example:

```typescript
const event = EventBuilder.default().withTitle("Community Run").build();
```

---

## CI/CD Expectations

All pull requests should:

- Build successfully
- Pass automated tests
- Generate test reports
- Maintain code quality standards

---

## Definition of Done

A feature is considered complete when:

- Tests are implemented
- Tests pass locally
- CI pipeline passes
- Documentation is updated
- No duplicated implementation is introduced
- Engineering standards are satisfied
