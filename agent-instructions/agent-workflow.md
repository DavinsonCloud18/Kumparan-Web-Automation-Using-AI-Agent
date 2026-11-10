# Agent Workflow

This document defines the standard operational lifecycle for the AI Agent when exploring web applications, generating test cases, implementing Page Object Model (POM) automation scripts, and maintaining tests in collaboration with QA engineers.

---

## 1. Requirement & Scope Analysis

Before starting any task:
1. Inspect the existing repository structure and identify existing Page Objects, fixtures, and utilities.
2. Review relevant guidelines in `AGENTS.md` and `agent-instructions/`.
3. Clarify user requirements, scope, target URLs, and environment prerequisites.

---

## 2. Exploration with Playwright Agent

1. Explore the application to observe real behavior rather than making assumptions.
2. Record and state the exact prompt or instruction used to interact with Playwright Agent.
3. Inspect the DOM and accessibility tree to discover interactive elements and navigation flows.
4. Identify user journeys across:
   - Positive / happy paths
   - Negative / error handling scenarios
   - Input validation and edge / boundary conditions

---

## 3. Test Case Formulation & Proposal

Before writing automation code:
1. Document the proposed test scenarios clearly (Description, Pre-conditions, Steps, Expected Outcome).
2. Propose the implementation approach, detailing:
   - New or updated Page Objects
   - Locators to be used (prioritizing `data-qa-id`)
   - Proposed spec file naming (`*.spec.ts`)
3. Await review and approval of the test scenarios.

---

## 4. Test Implementation (Page Object Model)

1. **Page Objects (`pages/`):**
   - Declare locators as `readonly` properties and initialize them in the constructor.
   - Keep methods focused on user actions and state queries.
   - Do not include test-specific assertions inside Page Objects.
2. **Test Specs (`tests/`):**
   - Follow the Arrange, Act, Assert (AAA) pattern.
   - Use meaningful web-first assertions (`await expect(...)`).
   - Do not use arbitrary timeouts (`waitForTimeout()`).
   - Keep test data separate from test implementation logic.
   - Ensure tests are independent and deterministic.

---

## 5. Test Execution & Reporting

1. Execute every newly created or modified test using Playwright.
2. Report results transparently:
   - Test spec name and scenario name
   - Pass / Fail status and execution duration
   - Failure logs and root cause analysis if failed
   - Any environmental limitations or dependencies

---

## 6. Maintenance & Defect Resolution

When fixing failing tests:
- Inspect actual DOM changes; never weaken or delete assertions simply to achieve a passing status.
- Do not skip tests or use arbitrary retries to hide flakiness.
- Document any assumptions, bug reports, or locator enhancement requests (such as requesting `data-qa-id`).

