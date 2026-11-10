import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

// Test credentials verified against the live environment
const VALID_CREDENTIALS = {
  email: 'davinson.works@gmail.com',
  password: 'Davinson123!@#',
};

const INVALID_EMAIL_CREDENTIALS = {
  email: 'davinson.works999@gmail.com',
  password: 'Davinson123!@#',
};

const INVALID_PASSWORD_CREDENTIALS = {
  email: 'davinson.works@gmail.com',
  password: 'Davinson123',
};

test.describe('Desktop Authentication & Session Management (Phase 1)', () => {
  test('LGN-001: Verifikasi Login dengan kredensial yang valid', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // 1. Navigate to homepage
    await homePage.goto();
    await expect(homePage.loginButton).toBeVisible();

    // 2. Click login button from header
    await homePage.clickLogin();
    await expect(page).toHaveURL('https://kumparan.com/login');
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });

    // 3 & 4. Fill valid credentials and submit
    await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);

    // 5. Verify redirection to homepage and user avatar is displayed in header
    await expect(page).toHaveURL(/https:\/\/kumparan\.com\/(\?ref=login)?$/, { timeout: 15000 });
    await expect(homePage.userAvatar).toBeVisible({ timeout: 15000 });
  });

  test('LGN-002: Verifikasi Login menggunakan email yang invalid', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // 1. Navigate to homepage
    await homePage.goto();
    await expect(homePage.loginButton).toBeVisible();

    // 2. Click login button from header
    await homePage.clickLogin();
    await expect(page).toHaveURL('https://kumparan.com/login');
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });

    // 3 & 4. Fill invalid email and valid password
    await loginPage.login(INVALID_EMAIL_CREDENTIALS.email, INVALID_EMAIL_CREDENTIALS.password);

    // 5. Verify error message "Email atau Password Salah" is displayed
    await expect(loginPage.emailErrorMessage).toBeVisible({ timeout: 10000 });
    await expect(loginPage.emailErrorMessage).toHaveText('Email atau Password Salah');
  });

  test('LGN-003: Verifikasi Login menggunakan password yang invalid', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // 1. Navigate to homepage
    await homePage.goto();
    await expect(homePage.loginButton).toBeVisible();

    // 2. Click login button from header
    await homePage.clickLogin();
    await expect(page).toHaveURL('https://kumparan.com/login');
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });

    // 3 & 4. Fill valid email and invalid password
    await loginPage.login(INVALID_PASSWORD_CREDENTIALS.email, INVALID_PASSWORD_CREDENTIALS.password);

    // 5. Verify error message "Email atau Password Salah" is displayed
    await expect(loginPage.passwordErrorMessage).toBeVisible({ timeout: 10000 });
    await expect(loginPage.passwordErrorMessage).toHaveText('Email atau Password Salah');
  });

  test('LGN-004: Verifikasi tidak bisa login saat fields email dan password kosong', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // 1 & 2. Navigate to login page
    await homePage.goto();
    await expect(homePage.loginButton).toBeVisible();
    await homePage.clickLogin();
    await expect(page).toHaveURL('https://kumparan.com/login');

    // 3. Verify fields are empty and submit button is disabled
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });
    await expect(loginPage.emailInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
    await expect(loginPage.submitButton).toBeDisabled();

    // Attempt forced click on disabled submit button
    await loginPage.clickSubmit({ force: true });

    // Verify submission is prevented, URL remains /login, and no auth cookie is stored
    await expect(page).toHaveURL('https://kumparan.com/login');
    const cookies = await page.context().cookies();
    const authSessionCookie = cookies.find((c) =>
      ['token', 'jwt', 'auth_token', 'user_session', 'app_feature_data'].includes(c.name.toLowerCase())
    );
    expect(authSessionCookie).toBeUndefined();
  });

  test('LGN-005: Bisa akses Halaman Homepage tanpa perlu login', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);

    // 1. Navigate directly to Kumparan homepage in guest context
    await homePage.goto();

    // Verify homepage brand logo, header navigation, and guest Masuk button are visible
    await expect(homePage.brandLogo).toBeVisible({ timeout: 15000 });
    await expect(homePage.loginButton).toBeVisible();
    await expect(homePage.loginButton).toHaveText('Masuk');

    // Verify editorial content is loaded for guest users
    await expect(homePage.getFirstArticleCard()).toBeVisible();

    // Verify user profile avatar is NOT present in guest state
    await expect(homePage.userAvatar).toHaveCount(0);
  });

  test('LGN-006: Bisa Logout dari dalam Sistem', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // 1. Perform login with valid credentials
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });
    await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);

    // Verify redirected to homepage with authenticated user avatar
    await expect(page).toHaveURL(/https:\/\/kumparan\.com\/(\?ref=login)?$/, { timeout: 15000 });
    await expect(homePage.userAvatar).toBeVisible({ timeout: 15000 });

    // 2. Click user avatar in header to open profile dropdown
    await homePage.clickUserAvatar();
    await expect(homePage.logoutButton).toBeVisible({ timeout: 10000 });

    // 3. Click Keluar (Logout) button
    await homePage.clickLogout();

    // Verify session terminated: redirected to homepage and Masuk button is restored
    await expect(page).toHaveURL('https://kumparan.com/', { timeout: 15000 });
    await expect(homePage.loginButton).toBeVisible({ timeout: 15000 });
    await expect(homePage.userAvatar).toHaveCount(0);
  });
});
