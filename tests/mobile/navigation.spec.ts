import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ChannelPage } from '../../pages/ChannelPage';
import { BreakingNewsPage } from '../../pages/BreakingNewsPage';
import { TrendingPage } from '../../pages/TrendingPage';
import { NotFoundPage } from '../../pages/NotFoundPage';

test.describe('Mobile Navigation & Routing Resilience (Phase 2 - Mobile)', () => {
  test('NAV-001: Bisa berpindah page artikel melalui channel navigation', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const channelPage = new ChannelPage(page);

    // 1. Navigate to mobile homepage
    await homePage.goto();

    // 2. Locate and tap "Tekno" channel link from mobile horizontal scroll navigation
    const teknoChannelLink = page.locator('a[data-qa-id="topnav"]:has-text("Tekno")');
    await expect(teknoChannelLink).toBeVisible({ timeout: 15000 });
    await teknoChannelLink.click();

    // 3. Verify destination URL
    await expect(page).toHaveURL(/https:\/\/m\.kumparan\.com\/channel\/tekno\/?|https:\/\/kumparan\.com\/channel\/tekno\/?/, { timeout: 15000 });

    // 4. Verify channel page title and feed articles
    await expect(page).toHaveTitle(/Teknologi.*kumparan/i);
    await expect(channelPage.getFirstArticle()).toBeVisible({ timeout: 15000 });
  });

  test('NAV-002: Bisa berpindah page melalui kumparan highlighted article', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const breakingNewsPage = new BreakingNewsPage(page);

    // 1. Navigate to mobile homepage
    await homePage.goto();

    // 2. Locate and tap "Breaking News" highlighted news badge from top navigation
    const breakingNewsBadge = page.locator('a[data-qa-id="nb-top-news"]');
    await expect(breakingNewsBadge).toBeVisible({ timeout: 15000 });
    await breakingNewsBadge.click();

    // 3. Verify destination URL
    await expect(page).toHaveURL(/https:\/\/m\.kumparan\.com\/breakingnews\/?|https:\/\/kumparan\.com\/breakingnews\/?/, { timeout: 15000 });

    // 4. Verify mobile breaking news hero card and titles render
    await expect(breakingNewsPage.heroCard).toBeVisible({ timeout: 15000 });
    await expect(breakingNewsPage.getFirstTitle()).toBeVisible({ timeout: 15000 });
  });

  test('NAV-003: Bisa berpindah page dengan valid URL', async ({ page }) => {
    test.slow();

    const trendingPage = new TrendingPage(page);

    // 1. Navigate directly to valid destination URL (https://m.kumparan.com/trending)
    await trendingPage.goto();

    // 2. Verify destination URL and page title
    await expect(page).toHaveURL(/https:\/\/m\.kumparan\.com\/trending\/?|https:\/\/kumparan\.com\/trending\/?/, { timeout: 15000 });
    await expect(page).toHaveTitle(/Trending.*kumparan/i);
    await expect(trendingPage.pageTitle).toHaveText('Trending');

    // 3. Verify trending feed cards render
    await expect(trendingPage.newsItems.first()).toBeVisible({ timeout: 15000 });
  });

  test('NAV-004: Verifikasi berpindah page dengan invalid URL', async ({ page }) => {
    test.slow();

    const notFoundPage = new NotFoundPage(page);

    // 1. Navigate directly to non-existent mobile route URL
    await notFoundPage.goto('https://kumparan.com/trendingssds');

    // 2. Verify URL remains on the invalid path
    await expect(page).toHaveURL(/trendingssds/);

    // 3. Verify mobile 404 container and messaging
    await expect(notFoundPage.container).toBeVisible({ timeout: 15000 });
    await expect(notFoundPage.errorMessage).toBeVisible({ timeout: 15000 });
    await expect(notFoundPage.errorMessage).toHaveText('Maaf, halaman tidak ditemukan');
    await expect(notFoundPage.backToHomeButton).toBeVisible();
    await expect(notFoundPage.backToHomeButton).toHaveText('Lihat konten lain');
  });
});

