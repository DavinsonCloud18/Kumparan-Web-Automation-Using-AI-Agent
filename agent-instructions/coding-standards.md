
# Coding Standards

## Language
- Use TypeScript.
- Use async/await for asynchronous operations.
- Avoid any unless absolutely necessary.
- Use meaningful variable and method names.

## Naming Conventions

- Classes: PascalCase
- Methods: camelCase
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Test files: *.spec.ts

## Page Object Model

- Keep page interactions inside Page Object classes.
- Declare reusable locators as readonly properties.
- Initialize locators in the constructor.
- Keep methods focused on specific responsibilities.
- Avoid putting test-specific business assertions inside Page Objects.
- Reuse existing page classes where appropriate.

## Test Implementation

- Keep test scenarios in spec files.
- Avoid duplicating login or navigation logic.
- Use fixtures for reusable setup and dependencies.
- Keep test data outside test implementation.
- Use meaningful assertions in each test.

## Code Quality

- Avoid unnecessary abstractions.
- Avoid duplicated code.
- Avoid unnecessary comments.
- Prefer readable code over overly compact implementations.
- Follow existing project conventions.
- Do not introduce new dependencies without justification.
