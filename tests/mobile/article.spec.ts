import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ArticlePage } from '../../pages/ArticlePage';
import { CommentPage } from '../../pages/CommentPage';

test.describe('Editorial Article & Engagement (Phase 4 - Mobile)', () => {
  test('ATC-001: Bisa melihat detail artikel', async ({ page }) => {
    test.slow();

    const homePage = new HomePage(page);
    const articlePage = new ArticlePage(page);

    // 1. Navigate to mobile homepage
    await homePage.goto();

    // 2. Locate first standard editorial card title
    await expect(homePage.firstStandardArticleTitle).toBeVisible({ timeout: 15000 });

    const expectedHeadline = (
      await homePage.firstStandardArticleTitle.innerText()
    ).trim();
    const expectedHref = await homePage.firstStandardArticleLink.getAttribute('href');

    expect(expectedHeadline.length).toBeGreaterThan(0);
    expect(expectedHref).toBeTruthy();

    // 3. Open article on mobile via the card link
    await homePage.firstStandardArticleLink.click();

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

    // 1. Navigate to mobile homepage and select first standard editorial article
    await homePage.goto();
    await expect(homePage.firstStandardArticleTitle).toBeVisible({ timeout: 15000 });
    await homePage.firstStandardArticleLink.click();
    await expect(articlePage.storyTitle).toBeVisible({ timeout: 15000 });

    // 2. Check mobile comment trigger behavior
    // On mobile web (m.kumparan.com), comment button is either hidden via inline style (display: none)
    // or routes to /response/<slug> where comment submission is disallowed/not mounted for guests.
    if (await articlePage.commentTrigger.isVisible()) {
      await articlePage.clickComment();
      await expect(page).toHaveURL(/\/response\//, { timeout: 15000 });
      // Guest users cannot submit comments: either redirected to /login or blocked from commenting
      if (await commentPage.commentTextarea.isVisible()) {
        await commentPage.fillComment('lorem ipsum bla bla bla');
        await commentPage.clickSend();
        await expect(page).toHaveURL(/.*\/login/, { timeout: 15000 });
      }
    } else {
      // If comment trigger is not exposed on mobile web for this article, verify engagement guard holds
      await expect(commentPage.commentSection).not.toBeVisible();
    }
  });

  test('ATC-005: Tidak bisa melakukan polling news ketika belum login', async ({ page }) => {
    test.slow();

    const articlePage = new ArticlePage(page);

    // 1. Navigate to Kumparan Polling topic feed on mobile device
    await page.goto('https://kumparan.com/topic/polling-kumparan', { waitUntil: 'domcontentloaded' });

    // 2. Select first active polling article from feed
    const pollingCard = page.locator('a[aria-label="news-card-label-link"]').first();
    await expect(pollingCard).toBeVisible({ timeout: 15000 });

    // 3. Open the polling article
    await pollingCard.click();

    // 4. Verify polling section and choice buttons render on mobile
    await expect(page).toHaveURL(/\/polling-/, { timeout: 15000 });
    await expect(articlePage.pollingTitle).toBeVisible({ timeout: 15000 });
    await expect(articlePage.pollingOptionButtons.first()).toBeVisible({ timeout: 15000 });

    // 5. Click top polling choice in unauthenticated guest session
    await articlePage.clickFirstPollingOption();

    // 6. Verify vote is blocked and user is redirected to /login
    await expect(page).toHaveURL(/.*\/login/, { timeout: 15000 });
  });
});
