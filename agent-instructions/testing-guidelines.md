
# Testing Guidelines

## 1. Test Case Design

Use Playwright Agent to explore the application and help identify:
- Main user journeys
- Positive scenarios
- Negative scenarios
- Input validation
- Boundary conditions
- Navigation behavior
- Error handling

Test cases must be based on observed application behavior
and verified requirements.

## 2. Test Structure

Follow Arrange, Act, Assert (AAA) where appropriate.

- Arrange: Prepare the required state and test data.
- Act: Perform the user interaction.
- Assert: Verify the expected application behavior.

## 3. Assertions

Every test must contain meaningful assertions.

Examples:
- Verify successful navigation.
- Verify expected page content.
- Verify successful form submission.
- Verify validation messages.
- Verify error handling.
- Verify the resulting application state.

Avoid tests that only click buttons, fill inputs, or navigate
without validating the outcome.

Use Playwright's expect().

Prefer web-first assertions such as:

await expect(page).toHaveURL(/dashboard/);

await expect(successMessage).toBeVisible();

await expect(loginButton).toBeEnabled();

## 4. Test Independence

- Tests must be independently executable.
- Avoid relying on the execution order of other tests.
- Use appropriate setup and teardown.
- Avoid shared mutable state between tests.
- Use isolated test data when necessary.

## 5. Test Reliability

- Prefer Playwright auto-waiting.
- Avoid unnecessary waitForTimeout().
- Avoid unstable selectors.
- Avoid unnecessary dependencies on external services.
- Do not use arbitrary retries to hide unstable tests.

## 6. Test Readability

- Use descriptive test names.
- Keep test scenarios focused.
- Avoid overly complicated test logic.
- Reuse existing Page Objects and fixtures.
- Make expected outcomes clear.

## 7. Test Execution

Every newly generated test must be executed.

Report:
- Test file and test case name.
- Pass/fail status.
- Failure reason.
- Any environmental limitations.

A generated test is not considered validated
until it has been executed successfully.
