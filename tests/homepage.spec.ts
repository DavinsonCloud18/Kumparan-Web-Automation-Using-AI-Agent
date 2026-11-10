import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Homepage Test Suite', () => {
  test('TC-HOME-001: Verify Homepage Initial Load and Core Components', async ({ page }) => {
    // Arrange: Initialize HomePage Page Object
    const homePage = new HomePage(page);

    // Act: Navigate to the homepage
    await homePage.goto();

    // Assert: Verify document title
    await expect(page).toHaveTitle(/kumparan\.com - Bicara Fakta Lewat Berita/);

    // Assert: Verify visibility of core layout components via web-first assertions
    await expect(homePage.brandLogo).toBeVisible();
    await expect(homePage.channelNavigation).toBeVisible();
    await expect(homePage.searchInput).toBeVisible();
  });

  test('TC-HOME-002: Verify News Feed Article Cards Rendering', async ({ page }) => {
    // Arrange: Initialize HomePage Page Object
    const homePage = new HomePage(page);

    // Act: Navigate to the homepage
    await homePage.goto();

    // Assert: Verify that article cards are loaded and rendered in the feed (dynamic count > 0)
    const firstCard = homePage.getFirstArticleCard();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    const cardCount = await homePage.articleCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Assert: Verify first card contains a valid non-empty href matching observed article URL structure
    await expect(firstCard).toHaveAttribute(
      'href',
      /^\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+-[0-9a-zA-Z]{11}$/
    );

    await expect(firstCard).toContainText(/\S/);
  });
});
