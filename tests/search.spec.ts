import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';

test.describe('Search Engine & Input Limits (Phase 3 - Desktop)', () => {
  test('SRC-001: Mencari Artikel dengan valid Keyword', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const searchQuery = 'penyadapan';

    // 1. Navigate to homepage
    await homePage.goto();
    await expect(homePage.searchInput).toBeVisible({ timeout: 15000 });

    // 2. Click search input to open search page and submit query
    await homePage.clickSearchInput();
    await expect(page).toHaveURL(/https:\/\/kumparan\.com\/search\/?$/, { timeout: 15000 });
    await searchPage.submitSearch(searchQuery);

    // 3. Verify destination URL and search results
    await expect(page).toHaveURL(new RegExp(`/search/${searchQuery}$`), { timeout: 15000 });
    await expect(searchPage.pageTitle).toBeVisible({ timeout: 15000 });
    await expect(searchPage.pageTitle).toHaveText('Hasil Pencarian');

    // Verify filter tabs
    await expect(searchPage.tabStory).toBeVisible();
    await expect(searchPage.tabVideoStory).toBeVisible();

    // Verify result cards render matching content
    const firstResult = searchPage.getFirstResultCard();
    await expect(firstResult).toBeVisible({ timeout: 15000 });
    const firstTitle = firstResult.locator('[data-qa-id="title"]');
    await expect(firstTitle).toBeVisible();
    await expect(firstTitle).toContainText(/\S/);
  });

  test('SRC-002: Menghapus kata kunci setelah melakukan search article', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const searchQuery = 'penyadapan';

    // 1. Navigate to homepage and perform search
    await homePage.goto();
    await homePage.clickSearchInput();
    await searchPage.submitSearch(searchQuery);

    // Verify search results page is active
    await expect(page).toHaveURL(new RegExp(`/search/${searchQuery}$`), { timeout: 15000 });
    await expect(searchPage.resultCards.first()).toBeVisible({ timeout: 15000 });
    await expect(searchPage.clearIcon).toBeVisible({ timeout: 10000 });

    // 2. Click the clear icon (x-circle)
    await searchPage.clickClear();

    // 3. Verify input field is cleared and popular search section is restored
    await expect(searchPage.searchInput).toHaveValue('');
    await expect(page).toHaveURL(/https:\/\/kumparan\.com\/search\/?$/, { timeout: 15000 });
    await expect(searchPage.pageTitle).toHaveText('Pencarian');
    await expect(searchPage.popularSearchSection).toBeVisible({ timeout: 10000 });
  });

  test('SRC-003: Mencari artikel dengan kata kunci simbol-simbol', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const symbolQuery = '$%^&*';

    // 1. Navigate to search landing
    await homePage.goto();
    await homePage.clickSearchInput();
    await expect(page).toHaveURL(/https:\/\/kumparan\.com\/search\/?$/, { timeout: 15000 });

    // 2. Submit symbol query
    await searchPage.submitSearch(symbolQuery);

    // 3. Verify empty state behavior
    // Per requirement/expected result: System displays clean empty state ("Story tidak ditemukan")
    // Known Bug Tracking: Kumparan continues displaying unfiltered articles instead of empty state feedback
    await expect(searchPage.emptyStateContainer).toBeVisible({ timeout: 10000 });
    await expect(searchPage.emptyStateHeadline).toBeVisible();
    await expect(searchPage.emptyStateHeadline).toHaveText('Story tidak ditemukan');
    await expect(searchPage.resultCards).toHaveCount(0);
  });
});
