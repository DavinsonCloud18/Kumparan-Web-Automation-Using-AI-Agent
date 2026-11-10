import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ChannelPage } from '../pages/ChannelPage';
import { BreakingNewsPage } from '../pages/BreakingNewsPage';
import { TrendingPage } from '../pages/TrendingPage';
import { NotFoundPage } from '../pages/NotFoundPage';

test.describe('Global Navigation & Routing Resilience (Phase 2 - Desktop)', () => {
  test('NAV-001: Bisa berpindah page artikel melalui channel navigation', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const channelPage = new ChannelPage(page);

    // 1. Navigate to Kumparan homepage
    await homePage.goto();
    await expect(homePage.channelNavigation).toBeVisible({ timeout: 15000 });

    // 2. Click "Tekno" channel link on main navigation menu
    await homePage.navigateToChannel('Tekno');

    // 3. Verify destination URL
    await expect(page).toHaveURL(/https:\/\/kumparan\.com\/channel\/tekno\/?$/, { timeout: 15000 });

    // 4. Verify channel heading and feed articles
    await expect(channelPage.channelTitle).toBeVisible({ timeout: 15000 });
    await expect(channelPage.channelTitle).toHaveText('Tekno');
    await expect(channelPage.getFirstArticle()).toBeVisible({ timeout: 15000 });
  });

  test('NAV-002: Bisa berpindah page melalui kumparan highlighted article', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const breakingNewsPage = new BreakingNewsPage(page);

    // 1. Navigate to Kumparan homepage
    await homePage.goto();
    await expect(homePage.subMenuNavigation).toBeVisible({ timeout: 15000 });

    // 2. Click "Breaking News" in highlighted sub-menu navigation
    await homePage.clickHighlightedMenu('Breaking News');

    // 3. Verify destination URL
    await expect(page).toHaveURL(/https:\/\/kumparan\.com\/breakingnews\/?$/, { timeout: 15000 });

    // 4. Verify breaking news content components
    await expect(breakingNewsPage.heroCard).toBeVisible({ timeout: 15000 });
    await expect(breakingNewsPage.getFirstTitle()).toBeVisible({ timeout: 15000 });
  });

  test('NAV-003: Bisa berpindah page dengan valid URL', async ({ page }) => {
    test.slow();

    const trendingPage = new TrendingPage(page);

    // 1. Navigate directly to valid destination URL (https://kumparan.com/trending)
    await trendingPage.goto();

    // 2. Verify destination URL and page title
    await expect(page).toHaveURL(/https:\/\/kumparan\.com\/trending\/?$/, { timeout: 15000 });
    await expect(trendingPage.pageTitle).toBeVisible({ timeout: 15000 });
    await expect(trendingPage.pageTitle).toHaveText('Trending');

    // 3. Verify trending feed cards are rendered
    await expect(trendingPage.newsItems.first()).toBeVisible({ timeout: 15000 });
  });

  test('NAV-004: Verifikasi berpindah page dengan invalid URL', async ({ page }) => {
    test.slow();

    const notFoundPage = new NotFoundPage(page);

    // 1. Navigate directly to non-existent route URL
    await notFoundPage.goto('https://kumparan.com/trendingssds');

    // 2. Verify URL remains on the invalid path
    await expect(page).toHaveURL('https://kumparan.com/trendingssds');

    // 3. Verify Kumparan 404 container and messaging
    await expect(notFoundPage.container).toBeVisible({ timeout: 15000 });
    await expect(notFoundPage.errorMessage).toBeVisible({ timeout: 15000 });
    await expect(notFoundPage.errorMessage).toHaveText('Maaf, halaman tidak ditemukan');
    await expect(notFoundPage.backToHomeButton).toBeVisible();
    await expect(notFoundPage.backToHomeButton).toHaveText('Lihat konten lain');
  });
});

