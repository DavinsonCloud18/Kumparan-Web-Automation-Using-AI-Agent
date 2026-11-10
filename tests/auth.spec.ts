import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication Test Suite', () => {
  test('TC-AUTH-001: Navigate to Login Page from Header Trigger', async ({ page }) => {
    // Increase test timeout budget for live site route transition
    test.slow();

    // Arrange: Initialize Page Objects
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // Act: Navigate to the Kumparan homepage
    await homePage.goto();

    // Assert: Verify the header login button is visible
    await expect(homePage.loginButton).toBeVisible();

    // Act: Click the header login button
    await homePage.clickLogin();

    // Assert: Verify URL navigation to the login page
    await expect(page).toHaveURL('https://kumparan.com/login');

    // Assert: Verify the email input, password input, and submit button are visible
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('TC-AUTH-002: Submit Empty Credentials on Login Form', async ({ page }) => {
    // Increase test timeout budget for live site route transition
    test.slow();

    // Arrange: Initialize LoginPage Page Object
    const loginPage = new LoginPage(page);

    // Act: Navigate directly to the login page
    await loginPage.goto();

    // Assert: Verify email and password inputs are visible and empty
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });
    await expect(loginPage.emailInput).toHaveValue('');
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveValue('');
    await expect(loginPage.submitButton).toBeVisible();

    // Act: Click the login submit button with empty credentials (using force: true because button has disabled attribute when empty)
    await loginPage.clickSubmit({ force: true });

    // Assert: Verify URL remains on the login page without redirection
    await expect(page).toHaveURL('https://kumparan.com/login');

    // Assert: Verify the email and password inputs remain visible and empty
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.emailInput).toHaveValue('');
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveValue('');

    // Assert: Verify submit button remains visible and no auth token session is established
    await expect(loginPage.submitButton).toBeVisible();
    const cookies = await page.context().cookies();
    const authSessionCookie = cookies.find((c) =>
      ['token', 'jwt', 'auth_token', 'user_session'].includes(c.name.toLowerCase())
    );
    expect(authSessionCookie).toBeUndefined();
  });

  test('TC-AUTH-003: Toggle Password Input Visibility', async ({ page }) => {
    // Increase test timeout budget for live site route transition
    test.slow();

    const testPassword = 'TestSecret123!';

    // Arrange: Initialize LoginPage Page Object
    const loginPage = new LoginPage(page);

    // Act: Navigate directly to the login page
    await loginPage.goto();

    // Assert & Act: Verify password input is visible and enter test password
    await expect(loginPage.passwordInput).toBeVisible({ timeout: 15000 });
    await loginPage.fillPassword(testPassword);
    await expect(loginPage.passwordInput).toHaveValue(testPassword);

    // Assert: Password input initially has type="password" and eye icon is visible
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.passwordToggle).toBeVisible();
    await expect(loginPage.eyeIcon).toBeVisible();

    // Act: Click the eye-toggle button to reveal password
    await loginPage.togglePasswordVisibility();

    // Assert: Password input type updates to "text" and eye-off icon becomes visible
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    await expect(loginPage.eyeOffIcon).toBeVisible();

    // Act: Click the eye-toggle button again to mask password
    await loginPage.togglePasswordVisibility();

    // Assert: Password input type returns to "password" and eye icon becomes visible
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.eyeIcon).toBeVisible();
  });
});



