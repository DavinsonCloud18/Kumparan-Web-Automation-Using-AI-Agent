
# Locator Strategy

## Primary Locator

Use data-qa-id as the preferred locator.

Example:

page.locator('[data-qa-id="login-button"]');

## Fallback Locator Priority

When data-qa-id is unavailable, explore other stable locators:

1. getByRole()
2. getByLabel()
3. getByPlaceholder()
4. getByText() when appropriate
5. Other stable attributes
6. CSS selectors based on stable attributes
7. XPath only as a last resort

## Locator Rules

- Inspect the actual DOM before selecting a locator.
- Prefer selectors that represent the element's purpose.
- Avoid dynamically generated CSS classes.
- Avoid styling-dependent selectors.
- Avoid positional selectors such as nth() unless justified.
- Ensure the locator identifies the intended element uniquely.
- Use exact matching when multiple elements have similar names.
- Do not invent data-qa-id attributes that do not exist.

## When No Stable Locator Exists

1. Explore the DOM and accessibility tree.
2. Identify attributes that remain stable across page changes.
3. Consider combining parent and child locators.
4. Explain why the selected locator is reliable.
5. Recommend adding a data-qa-id attribute if the application
   can be modified to support test automation.

## Example

Preferred:

page.locator('[data-qa-id="login-button"]');

Alternative:

page.getByRole('button', { name: 'Login', exact: true });

Avoid:

page.locator('.css-1x93k2');

Reason:
Generated styling classes may change without any
change in the application's functionality.
