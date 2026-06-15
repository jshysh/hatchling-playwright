Playwright E2E Framework Architecture & Engineering Guide
Welcome to the E2E automation framework. This framework is built from scratch using TypeScript and Playwright, adhering strictly to Object-Oriented Design (OOD) and SOLID principles.

Our core goals are flawless test stability, zero code duplication (DRY), and seamless compatibility with AI coding assistants (Cursor).

📁 Directory Structure & Responsibilities
Plaintext
├── data/ # Test data management, JSON payloads, data builders
├── fixtures/ # Custom Playwright test extensions (Dependency Injection)
├── pages/ # Page Object Model (POM) classes (UI encapsulation)
├── tests/ # Declarative test specs (.spec.ts files)
├── utils/ # Stateless helpers, API clients, DB connectors, constants
└── .cursorrules # Guardrails for AI-driven code generation

🗂️ pages/ (The Action Layer)
Every web page, component, or modal must have its own class here.

- Rules:
  ** Define locators as private readonly at the top of the class using user-facing selectors (getByRole, getByTestId).
  ** Expose public, async methods that represent user intentions (e.g., loginToDashboard()), not atomic steps (don't create clickUsernameInput()).
  \*\* Strict Isolation: No assertions allowed in page objects. They return data or transitions; they do not validate results.

🗂️ fixtures/ (The Glue Layer)
This is our dependency injection engine. We extend Playwright’s base test to automatically instantiate pages.

- Rules:
  ** Never manually instantiate page objects inside tests using new PageObject(page).
  ** Every page object must be registered in a custom fixture file (e.g., baseTest.ts).
  \*\* Tests must import test from this folder, not from @playwright/test.

🗂️ tests/ (The Narrative Layer)
This contains your actual test scenarios (.spec.ts).

- Rules:
  ** Tests should read like a user story or a BDD scenario (Given/When/Then flow).
  ** All assertions live here using Playwright’s web-first expect().
  \*\* Absolutely no raw locators or hardcoded magic strings/timeouts allowed here.

🗂️ data/ (The State Layer)
Manages environment variables, user credentials, and test payloads.

- Rules:
  ** For complex test data setup, use the Builder Pattern to dynamically generate payloads.
  ** Static mock payloads should live in clean JSON files here and be typed with TS interfaces.

🗂️ utils/ (The Core Infrastructure Layer)
Stateless, reusable utilities that do not belong to a specific page or UI component.

- Rules:
  ** Includes API clients for setting up test preconditions (e.g., bypassing UI login via API token generation).
  ** Includes date formatters, database query wrappers, or custom logger configurations.
