import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';

test.describe('Search Engine Test Suite', () => {
  test('TC-SRCH-001: Verify Search with Valid Query Displays Result Cards', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const searchQuery = 'teknologi';

    await homePage.goto();

    // Act
    await homePage.search(searchQuery);

    // Assert: Search URL
    await expect(page).toHaveURL(
      new RegExp(`/search/${searchQuery}$`)
    );

    // Assert: Search page heading
    await expect(searchPage.pageTitle).toBeVisible();
    await expect(searchPage.pageTitle).toHaveText('Hasil Pencarian');

    // Assert: Search filter tabs
    await expect(searchPage.tabStory).toBeVisible();
    await expect(searchPage.tabStory).toHaveText('Konten');

    await expect(searchPage.tabVideoStory).toBeVisible();
    await expect(searchPage.tabVideoStory).toHaveText('Video Story');

    await expect(searchPage.tabKumparanPlus).toBeVisible();
    await expect(searchPage.tabKumparanPlus).toHaveText('kumparanPLUS');

    await expect(searchPage.tabTopic).toBeVisible();
    await expect(searchPage.tabTopic).toHaveText('Topik');

    // Assert: Search results
    const firstResult = searchPage.getFirstResultCard();

    await expect(firstResult).toBeVisible({
      timeout: 15000,
    });

    const firstTitle = firstResult.locator(
      '[data-qa-id="title"]'
    );

    await expect(firstTitle).toBeVisible();
    await expect(firstTitle).toContainText(/\S/);
  });

  test('TC-SRCH-002: Verify Search with Unmatched Query Displays Observed Empty State', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const unmatchedQuery = 'xyz999nonexistentquery123';

    await homePage.goto();

    // Act
    await homePage.search(unmatchedQuery);

    // Assert: Search URL
    await expect(page).toHaveURL(
      new RegExp(`/search/${unmatchedQuery}$`)
    );

    // Assert: Empty state container is visible
    await expect(searchPage.emptyStateContainer).toBeVisible({ timeout: 15000 });

    // Assert: Empty state headline and sub-headline text
    await expect(searchPage.emptyStateHeadline).toBeVisible();
    await expect(searchPage.emptyStateHeadline).toHaveText('Story tidak ditemukan');

    await expect(searchPage.emptyStateSubHeadline).toBeVisible();
    await expect(searchPage.emptyStateSubHeadline).toHaveText('Sudah benarkah story yang dicari?');

    // Assert: Result cards count is 0
    await expect(searchPage.resultCards).toHaveCount(0);
  });

  test('TC-SRCH-003: Verify Clicking Search Input from Homepage Navigates to Search Landing', async ({ page }) => {
    // Arrange
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);

    await homePage.goto();

    // Act: Click the search input without typing
    await homePage.clickSearchInput();

    // Assert: Verify URL navigates to /search
    await expect(page).toHaveURL(/\/search$/);

    // Assert: Verify heading 'Pencarian' is visible
    await expect(searchPage.pageTitle).toBeVisible();
    await expect(searchPage.pageTitle).toHaveText('Pencarian');

    // Assert: Verify popular search section is visible
    await expect(searchPage.popularSearchSection).toBeVisible();
    await expect(searchPage.popularSearchSection).toContainText('Pencarian populer');
  });
});