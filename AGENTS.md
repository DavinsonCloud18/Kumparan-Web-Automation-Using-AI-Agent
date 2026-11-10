
# Playwright AI Agent Project

## Project Purpose

This project is a collaborative Playwright automation framework built with TypeScript.

The primary objectives are:
- Explore websites using Playwright Agent.
- Identify application functionality and generate relevant test cases.
- Convert approved test cases into maintainable Playwright scripts.
- Validate actual application behavior through meaningful assertions.
- Make tests easy to understand, execute, debug, and maintain by other QA engineers.

## 1. Playwright Agent Usage

Use Playwright Agent to:
- Explore the target website and understand its functionality.
- Identify user journeys and possible test scenarios.
- Discover page elements, interactions, and navigation flows.
- Help generate test cases based on actual website behavior.
- Assist with generating and investigating Playwright tests.

Always provide the actual prompt or instruction used to interact with Playwright Agent.

Do not assume application behavior without exploring or verifying it.

## 2. Architecture

- Use TypeScript.
- Follow Page Object Model (POM) as the default architecture.
- Separate test scenarios from page interactions.
- Reuse existing Page Objects, fixtures, and utilities.
- Keep test data separate from test implementation.
- Avoid unnecessary abstractions and duplicated code.

## 3. Locator Strategy

- Prefer data-qa-id as the primary locator.
- Use other stable and reliable locators when data-qa-id is unavailable.
- Follow the locator strategy defined in agent-instructions/locator-strategy.md.
- Avoid brittle selectors and unnecessary positional locators.

## 4. Test Quality

- Every test must have meaningful assertions.
- Tests must validate expected application behavior, not just perform actions.
- Include positive, negative, and relevant boundary scenarios.
- Use Playwright's built-in expect() assertions.
- Never remove or weaken assertions simply to make a test pass.
- Keep tests independent and deterministic.

## 5. Maintainability

- Follow consistent naming conventions.
- Write readable and reusable code.
- Avoid unnecessary dependencies.
- Use appropriate fixtures and shared test data.
- Ensure other team members can easily execute and understand the tests.
- Document setup requirements and execution commands.

## 6. AI Agent Responsibilities

Before modifying code:
1. Read the relevant project instructions.
2. Inspect the existing project structure.
3. Understand existing implementation patterns.
4. Identify reusable components.
5. Explain the proposed approach for significant changes.

After modifying code:
1. Summarize changed files.
2. Explain important implementation decisions.
3. Run relevant Playwright tests.
4. Report test results and failures honestly.
5. Identify any assumptions or unresolved issues.

## 7. Restrictions

- Do not invent test expectations.
- Do not invent locators without inspecting the application.
- Do not skip failing tests without approval.
- Do not remove assertions to resolve failures.
- Do not modify credentials or secrets.
- Do not introduce architectural changes without justification.
- Do not commit or merge changes without authorization.

## 8. Team Collaboration

All AI-generated code must follow the same project standards.

Prioritize consistency, readability, reliability, and maintainability over generating code quickly.

Detailed guidelines:
- agent-instructions/coding-standards.md
- agent-instructions/testing-guidelines.md
- agent-instructions/locator-strategy.md
- agent-instructions/agent-workflow.md
