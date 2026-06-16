# Test Strategy

## Purpose

This document defines the automated testing strategy used by the Hatchling Playwright framework.

The objective is to provide fast, reliable feedback while maintaining a scalable and maintainable automation suite.

---

# Testing Goals

The framework aims to:

- Detect regressions early
- Validate critical user workflows
- Provide fast feedback to developers
- Minimize flaky tests
- Support continuous integration and delivery
- Reduce maintenance costs

---

# Test Pyramid

The framework follows a balanced testing pyramid.

```text
         E2E
       /     \
      UI Tests
    /           \
   API Tests
```

Priority:

1. API Tests
2. UI Tests
3. End-to-End Tests

### API Tests

API tests provide the fastest and most reliable validation.

Examples:

- User authentication
- Daycare listing creation
- Daycare listing updates

API tests should validate business rules whenever possible before relying on UI automation.

---

### UI Tests

UI tests validate user interactions and presentation-layer behavior.

Examples:

- Login
- Registration
- Daycare listing creation
- Profile management

UI tests should focus on user-visible functionality and avoid validating business logic already covered by API tests.

---

### End-to-End Tests

End-to-end tests validate complete business workflows across multiple layers.

Example:

1. Create user via API
2. Login through UI
3. Create event through UI
4. Verify event through API

These tests provide confidence that integrated systems function correctly.

Because E2E tests are slower and more expensive, only critical business workflows should be covered.

---

# Test Suite Classification

## Smoke Suite

Purpose:

Validate critical application functionality after deployment.

Examples:

- Login
- Create daycare listing

Execution:

- Every pull request
- Every deployment

Expected runtime:

Less than 5 minutes

---

## Regression Suite

Purpose:

Validate all supported application functionality.

Examples:

- Authentication
- Profiles
- Permissions

Execution:

- Nightly
- Before major releases

Expected runtime:

10-30 minutes

---

## End-to-End Suite

Purpose:

Validate complete user journeys.

Examples:

- User onboarding
- Daycare management lifecycle

Execution:

- Nightly
- Release candidates

Expected runtime:

As required

---

# Test Data Strategy

## Independent Tests

Tests must not depend on execution order.

Every test should create or provision its own required data.

---

## Test Data Creation

Preferred approaches:

1. API setup
2. Builders and factories
3. Database seeding

Avoid creating data through the UI when faster alternatives exist.

---

## Test Cleanup

Where practical:

- Delete created entities after execution
- Isolate test data between runs
- Avoid shared mutable test state

---

# Environment Strategy

Supported environments:

- Local
- Staging

Tests should be environment-agnostic and configured through environment variables.

Example:

```env
BASE_URL=
API_URL=
TEST_USER=
```

No environment-specific values should be hardcoded.

---

# Reliability Standards

## Locator Strategy

Preferred locator order:

1. getByRole
2. getByLabel
3. getByTestId
4. CSS selectors

Avoid XPath whenever possible.

---

## Synchronization

Use Playwright's built-in waiting mechanisms.

Avoid:

```typescript
page.waitForTimeout();
```

Prefer:

```typescript
expect(locator).toBeVisible();
```

or

```typescript
page.waitForResponse();
```

---

## Flaky Test Policy

A flaky test is considered a defect.

If a test fails intermittently:

1. Investigate root cause
2. Fix synchronization issues
3. Improve data isolation
4. Improve locator strategy

Retries should not replace defect resolution.

---

# CI/CD Strategy

Pull Requests:

- Execute smoke suite
- Publish reports
- Block merge on failures

Nightly Execution:

- Execute regression suite
- Generate reports
- Capture traces and screenshots on failures

---

# Reporting

Test execution should generate:

- HTML reports
- Failure screenshots
- Playwright traces
- CI artifacts

Reports should provide enough information to diagnose failures without reproducing them locally.

---

# Success Metrics

The framework should strive for:

- Stable execution
- Low maintenance overhead
- Fast feedback cycles
- High confidence in releases
- Minimal flaky tests

Reliability is prioritized over test quantity.
