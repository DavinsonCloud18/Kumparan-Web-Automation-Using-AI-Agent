import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Theme Toggle Test Suite', () => {
  test('TC-THM-001: Switch Theme from Initial Light Mode to Dark Mode', async ({ page }) => {
    // Arrange: Establish a deterministic light-mode baseline before navigation
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'light');
    });

    const homePage = new HomePage(page);

    // Act: Navigate to the homepage
    await homePage.goto();

    // Assert: Verify initial light mode state (localStorage and moon icon)
    await expect(homePage.themeToggleButton).toBeVisible();
    await expect(homePage.moonIcon).toBeVisible();

    const initialTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(initialTheme).toBe('light');

    // Act: Click the theme toggle button to switch to dark mode
    await homePage.toggleTheme();

    // Assert: Verify localStorage changes to 'dark'
    await expect.poll(async () => {
      return await page.evaluate(() => localStorage.getItem('theme'));
    }).toBe('dark');

    // Assert: Verify icon changes to sun
    await expect(homePage.sunIcon).toBeVisible();
  });

  test('TC-THM-002: Switch Theme from Dark Mode back to Light Mode', async ({ page }) => {
    // Arrange: Establish a deterministic dark-mode baseline before navigation
    await page.context().addCookies([
      { name: 'theme', value: 'dark', url: 'https://kumparan.com' },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
    });

    const homePage = new HomePage(page);

    // Act: Navigate to the homepage
    await homePage.goto();

    // Assert: Verify initial dark mode state (localStorage and sun icon)
    await expect(homePage.themeToggleButton).toBeVisible();
    await expect(homePage.sunIcon).toBeVisible();

    const initialTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(initialTheme).toBe('dark');

    // Act: Click the theme toggle button to switch to light mode
    await homePage.toggleTheme();

    // Assert: Verify localStorage changes to 'light'
    await expect.poll(async () => {
      return await page.evaluate(() => localStorage.getItem('theme'));
    }).toBe('light');

    // Assert: Verify icon changes to moon
    await expect(homePage.moonIcon).toBeVisible();
  });

  test('TC-THM-003: Verify Theme Preference Persistence Across Page Reload', async ({ page }) => {
    // Arrange: Establish a deterministic dark-mode baseline before navigation
    await page.context().addCookies([
      { name: 'theme', value: 'dark', url: 'https://kumparan.com' },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'dark');
    });

    const homePage = new HomePage(page);

    // Act: Navigate to the homepage
    await homePage.goto();

    // Assert: Verify initial dark mode state (theme button, sun icon, and localStorage)
    await expect(homePage.themeToggleButton).toBeVisible();
    await expect(homePage.sunIcon).toBeVisible();

    const initialTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(initialTheme).toBe('dark');

    // Act: Reload the page
    await page.reload();

    // Assert: Verify theme preference persists across reload (sun icon and localStorage)
    await expect(homePage.themeToggleButton).toBeVisible();
    await expect(homePage.sunIcon).toBeVisible();

    const reloadedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(reloadedTheme).toBe('dark');
  });
});



