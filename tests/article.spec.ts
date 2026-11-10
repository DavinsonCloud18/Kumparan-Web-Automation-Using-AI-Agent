import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ArticlePage } from '../pages/ArticlePage';
import { CommentPage } from '../pages/CommentPage';

test.describe('Editorial Article & Engagement (Phase 4 - Desktop)', () => {
  test('ATC-001: Bisa melihat detail artikel', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const articlePage = new ArticlePage(page);

    // 1. Navigate to homepage
    await homePage.goto();

    // 2. Locate first standard editorial card title
    await expect(homePage.firstStandardArticleTitle).toBeVisible({ timeout: 15000 });

    const expectedHeadline = (
      await homePage.firstStandardArticleTitle.innerText()
    ).trim();
    const expectedHref = await homePage.firstStandardArticleLink.getAttribute('href');

    expect(expectedHeadline.length).toBeGreaterThan(0);
    expect(expectedHref).toBeTruthy();

    // 3. Open article
    await homePage.firstStandardArticleTitle.click();

    // 4. Assert URL and article heading
    const escapedHref = expectedHref!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(page).toHaveURL(new RegExp(`${escapedHref}$`), { timeout: 15000 });
    await expect(articlePage.storyTitle).toBeVisible({ timeout: 15000 });
    await expect(articlePage.storyTitle).toHaveText(expectedHeadline);

    // 5. Assert breadcrumbs hierarchy: Beranda > <Nama Channel>
    await expect(articlePage.homeBreadcrumb).toBeVisible({ timeout: 15000 });
    await expect(articlePage.homeBreadcrumb).toHaveText('Beranda');
    await expect(articlePage.channelBreadcrumb).toBeVisible({ timeout: 15000 });
    await expect(articlePage.channelBreadcrumb).toContainText(/\S/);
  });

  test('ATC-003: Tidak bisa memberikan comment pada article ketika belum login', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const articlePage = new ArticlePage(page);
    const commentPage = new CommentPage(page);

    // 1. Navigate to homepage and open first standard article in unauthenticated guest session
    await homePage.goto();
    await expect(homePage.firstStandardArticleTitle).toBeVisible({ timeout: 15000 });
    await homePage.firstStandardArticleTitle.click();

    // 2. Click comment icon beneath title
    await expect(articlePage.commentTrigger).toBeVisible({ timeout: 15000 });
    await articlePage.clickComment();

    // 3. Verify comment drawer/page is loaded and enter comment text
    await expect(commentPage.commentSection).toBeVisible({ timeout: 15000 });
    await expect(commentPage.commentTextarea).toBeVisible({ timeout: 15000 });
    await commentPage.fillComment('lorem ipsum bla bla bla');

    // 4. Click Send button
    await commentPage.clickSend();

    // 5. Verify unauthenticated submission barrier: user redirected to /login
    await expect(page).toHaveURL(/https:\/\/kumparan\.com\/login/, { timeout: 15000 });
  });

  test('ATC-005: Tidak bisa melakukan polling news ketika belum login', async ({ page }) => {
    test.slow();

    const articlePage = new ArticlePage(page);

    // 1. Navigate to Kumparan Polling topic feed to access active news polling articles
    await page.goto('https://kumparan.com/topic/polling-kumparan', { waitUntil: 'domcontentloaded' });

    // 2. Select the first active polling article from the feed
    const pollingCard = page.locator('a[aria-label="news-card-label-link"]').first();
    await expect(pollingCard).toBeVisible({ timeout: 15000 });

    // 3. Open the polling article
    await pollingCard.click();

    // 4. Verify polling section and choices are rendered
    await expect(page).toHaveURL(/\/polling-/, { timeout: 15000 });
    await expect(articlePage.pollingTitle).toBeVisible({ timeout: 15000 });
    await expect(articlePage.pollingOptionButtons.first()).toBeVisible({ timeout: 15000 });

    // 5. Click top polling choice in unauthenticated guest state
    await articlePage.clickFirstPollingOption();

    // 6. Verify vote is blocked and user is redirected to /login
    await expect(page).toHaveURL(/https:\/\/kumparan\.com\/login/, { timeout: 15000 });
  });
});
