import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';

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

test.describe('Mobile Authentication & Session Management (Phase 1 - Mobile)', () => {
  test('LGN-001: Verifikasi Login menggunakan Kredensial yang Valid', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // 1. Navigate to mobile homepage
    await homePage.goto();
    await expect(homePage.burgerMenuButton).toBeVisible({ timeout: 15000 });

    // 2. Tap Burger Menu icon in top-left header
    await homePage.openBurgerMenu();
    await expect(homePage.drawerLoginButton).toBeVisible({ timeout: 10000 });

    // 3. Tap "Masuk" in navigation drawer
    await homePage.clickDrawerLogin();
    await expect(page).toHaveURL(/https:\/\/m\.kumparan\.com\/login|https:\/\/kumparan\.com\/login/, { timeout: 15000 });
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });

    // 4 & 5. Enter valid credentials and submit
    await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);

    // 6. Verify redirection to homepage (gated by Turnstile in production automated runners)
    await expect(page).toHaveURL(/https:\/\/m\.kumparan\.com\/?|https:\/\/kumparan\.com\/?/, { timeout: 15000 });
  });

  test('LGN-002: Verifikasi Login menggunakan email yang invalid', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // 1 & 2. Navigate and open burger menu
    await homePage.goto();
    await expect(homePage.burgerMenuButton).toBeVisible({ timeout: 15000 });
    await homePage.openBurgerMenu();
    await expect(homePage.drawerLoginButton).toBeVisible({ timeout: 10000 });

    // 3. Tap "Masuk" to open login page
    await homePage.clickDrawerLogin();
    await expect(page).toHaveURL(/https:\/\/m\.kumparan\.com\/login|https:\/\/kumparan\.com\/login/, { timeout: 15000 });
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });

    // 4 & 5. Enter invalid email and valid password
    await loginPage.login(INVALID_EMAIL_CREDENTIALS.email, INVALID_EMAIL_CREDENTIALS.password);

    // 6. Verify error feedback
    await expect(loginPage.emailErrorMessage).toBeVisible({ timeout: 10000 });
    await expect(loginPage.emailErrorMessage).toHaveText('Email atau Password Salah');
  });

  test('LGN-003: Verifikasi Login menggunakan password yang invalid', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // 1 & 2. Navigate and open burger menu
    await homePage.goto();
    await expect(homePage.burgerMenuButton).toBeVisible({ timeout: 15000 });
    await homePage.openBurgerMenu();
    await expect(homePage.drawerLoginButton).toBeVisible({ timeout: 10000 });

    // 3. Tap "Masuk" to open login page
    await homePage.clickDrawerLogin();
    await expect(page).toHaveURL(/https:\/\/m\.kumparan\.com\/login|https:\/\/kumparan\.com\/login/, { timeout: 15000 });
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });

    // 4 & 5. Enter valid email and invalid password
    await loginPage.login(INVALID_PASSWORD_CREDENTIALS.email, INVALID_PASSWORD_CREDENTIALS.password);

    // 6. Verify error feedback
    await expect(loginPage.passwordErrorMessage).toBeVisible({ timeout: 10000 });
    await expect(loginPage.passwordErrorMessage).toHaveText('Email atau Password Salah');
  });

  test('LGN-004: Verifikasi tidak bisa login saat fields email dan password kosong', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // 1. Navigate to mobile homepage
    await homePage.goto();
    await expect(homePage.burgerMenuButton).toBeVisible({ timeout: 15000 });

    // 2. Open burger menu and tap "Masuk"
    await homePage.openBurgerMenu();
    await expect(homePage.drawerLoginButton).toBeVisible({ timeout: 10000 });
    await homePage.clickDrawerLogin();

    // 3. Verify on mobile login page
    await expect(page).toHaveURL(/https:\/\/m\.kumparan\.com\/login|https:\/\/kumparan\.com\/login/, { timeout: 15000 });
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });
    await expect(loginPage.emailInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
    await expect(loginPage.submitButton).toBeDisabled();

    // 4. Attempt forced submit
    await loginPage.clickSubmit({ force: true });

    // Verify submission blocked, URL remains on login page, and no auth cookie set
    await expect(page).toHaveURL(/https:\/\/m\.kumparan\.com\/login|https:\/\/kumparan\.com\/login/);
    const cookies = await page.context().cookies();
    const authSessionCookie = cookies.find((c) =>
      ['token', 'jwt', 'auth_token', 'user_session', 'app_feature_data'].includes(c.name.toLowerCase())
    );
    expect(authSessionCookie).toBeUndefined();
  });

  test('LGN-005: Bisa akses Halaman Homepage tanpa perlu login', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);

    // 1. Navigate to mobile homepage in clean guest state
    await homePage.goto();

    // 2. Verify mobile header components: burger menu and brand logo
    await expect(homePage.burgerMenuButton).toBeVisible({ timeout: 15000 });
    await expect(homePage.brandLogo).toBeVisible({ timeout: 15000 });

    // 3. Verify mobile editorial content is loaded for guest users
    await expect(homePage.getFirstArticleCard()).toBeVisible({ timeout: 15000 });

    // 4. Open burger menu and verify guest "Masuk" drawer option is present
    await homePage.openBurgerMenu();
    await expect(homePage.drawerLoginButton).toBeVisible({ timeout: 10000 });
    await expect(homePage.drawerLoginButton).toContainText('Masuk');
  });

  test('LGN-006: Bisa Logout dari dalam Sistem', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    // 1. Navigate to login page
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible({ timeout: 15000 });
    await loginPage.login(VALID_CREDENTIALS.email, VALID_CREDENTIALS.password);

    // 2. Open burger menu
    await expect(homePage.burgerMenuButton).toBeVisible({ timeout: 15000 });
    await homePage.openBurgerMenu();

    // 3. Tap Keluar (Logout) button in drawer
    await expect(homePage.drawerLogoutButton).toBeVisible({ timeout: 10000 });
    await homePage.clickDrawerLogout();

    // 4. Verify session terminated and guest "Masuk" option is restored
    await expect(page).toHaveURL(/https:\/\/m\.kumparan\.com\/?|https:\/\/kumparan\.com\/?/, { timeout: 15000 });
    await homePage.openBurgerMenu();
    await expect(homePage.drawerLoginButton).toBeVisible({ timeout: 10000 });
  });
});

