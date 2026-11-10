
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ArticlePage } from '../pages/ArticlePage';
import { ChannelPage } from '../pages/ChannelPage';

test.describe('Article Test Suite', () => {

    test('TC-ART-001: Verify Opening Standard Editorial Article from Homepage', async ({ page }) => {
        test.slow();

        // Arrange
        const homePage = new HomePage(page);
        const articlePage = new ArticlePage(page);

        // Act: Navigate to homepage
        await homePage.goto();

        // Identify the first standard editorial article
        const firstArticle = homePage.getFirstStandardArticle();

        await expect(firstArticle).toBeVisible({ timeout: 15000 });

        // Extract dynamic article information
        const expectedHeadline = (
            await homePage.firstStandardArticleTitle.innerText()
        ).trim();

        const expectedHref =
            await homePage.firstStandardArticleLink.getAttribute('href');

        expect(expectedHeadline.length).toBeGreaterThan(0);
        expect(expectedHref).toBeTruthy();

        // Act: Open article
        await homePage.firstStandardArticleTitle.click();

        // Assert: URL
        const escapedHref = expectedHref!.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        );

        await expect(page).toHaveURL(
            new RegExp(`${escapedHref}$`)
        );

        // Assert: Page title
        await expect(page).toHaveTitle(
            new RegExp(expectedHeadline.replace(
                /[.*+?^${}()|[\]\\]/g,
                '\\$&'
            ))
        );

        // Assert: Article heading
        await expect(articlePage.storyTitle).toBeVisible({ timeout: 15000 });
        await expect(articlePage.storyTitle).toHaveText(expectedHeadline);

        // Assert: Author metadata
        await expect(articlePage.authorName).toBeVisible();
        await expect(articlePage.authorName).not.toBeEmpty();

        // Assert: Publication date
        await expect(articlePage.publishDate).toBeVisible();
        await expect(articlePage.publishDate).not.toBeEmpty();

        // Assert: Article content
        await expect(articlePage.storyParagraphs.first()).toBeVisible();
        await expect(articlePage.storyParagraphs.first()).not.toBeEmpty();

        // Assert: Breadcrumbs
        await expect(articlePage.homeBreadcrumb).toBeVisible();
        await expect(articlePage.channelBreadcrumb).toBeVisible();
    });


    test('TC-ART-002: Verify Breadcrumb Navigation from Editorial Article to Channel Feed', async ({ page }) => {
        test.slow();

        const homePage = new HomePage(page);
        const articlePage = new ArticlePage(page);
        const channelPage = new ChannelPage(page);

        // 1. Arrange: Open a standard editorial article
        await homePage.goto();

        const firstArticle = homePage.getFirstStandardArticle();
        await expect(firstArticle).toBeVisible({ timeout: 15000 });

        await homePage.firstStandardArticleTitle.click();

        // 2. Verify article breadcrumbs
        await expect(articlePage.homeBreadcrumb).toBeVisible({ timeout: 15000 });
        await expect(articlePage.channelBreadcrumb).toBeVisible();

        // 3. Extract dynamic channel information
        const expectedChannelName = (
            await articlePage.channelBreadcrumb.innerText()
        ).trim();

        const expectedChannelHref =
            await articlePage.channelBreadcrumb.getAttribute('href');

        expect(expectedChannelName).toBeTruthy();

        expect(expectedChannelHref).toMatch(
            /^\/channel\/[a-z0-9-]+$/
        );

        // 4. Act: Navigate to the channel feed
        await articlePage.channelBreadcrumb.click();

        // 5. Verify destination URL
        await expect(page).toHaveURL(
            new RegExp(`${expectedChannelHref}$`)
        );

        // 6. Verify channel heading
        await expect(channelPage.channelTitle).toBeVisible({ timeout: 15000 });
        await expect(channelPage.channelTitle).toHaveText(
            expectedChannelName
        );

        // 7. Verify channel feed
        await expect(channelPage.channelArticles.first()).toBeVisible({ timeout: 15000 });
    });


    test('TC-ART-003: Verify Editorial Article Main Content and Media Rendering', async ({ page }) => {
        test.slow();

        const homePage = new HomePage(page);
        const articlePage = new ArticlePage(page);

        // Arrange: Open a standard editorial article
        await homePage.goto();

        const firstArticle = homePage.getFirstStandardArticle();
        await expect(firstArticle).toBeVisible({ timeout: 15000 });

        await homePage.firstStandardArticleTitle.click();

        // Wait until article navigation has completed
        await expect(articlePage.storyTitle).toBeVisible({ timeout: 15000 });

        // 1. Verify article main container
        await expect(articlePage.articleMain).toBeVisible();

        // 2. Verify editorial paragraphs
        const paragraphs = articlePage.storyParagraphs;

        await expect(paragraphs.first()).toBeVisible();

        const paragraphCount = await paragraphs.count();

        expect(paragraphCount).toBeGreaterThan(0);

        // Verify every paragraph contains meaningful text
        for (let index = 0; index < paragraphCount; index++) {
            await expect(paragraphs.nth(index)).toHaveText(/\S/);
        }

        // 3. Verify lead or inline image, if present
        const imageFigureCount = await articlePage.imageFigures.count();

        if (imageFigureCount > 0) {
            const firstFigure = articlePage.imageFigures.first();
            const image = firstFigure.locator('img:not([data-qa-id="zoom-in-white"])');

            await image.scrollIntoViewIfNeeded();

            await expect(image).toBeVisible();

            await expect(image).toHaveAttribute(
                'src',
                /^https?:\/\/.+/
            );

            // Verify that the image actually loaded
            await expect.poll(
                () =>
                    image.evaluate(
                        (element: HTMLImageElement) =>
                            element.complete && element.naturalWidth > 0
                    )
            ).toBe(true);

            // Verify caption, if present
            const caption = firstFigure.locator('figcaption');

            if (await caption.count() > 0) {
                await expect(caption).toBeVisible();
                await expect(caption).toHaveText(/\S/);
            }
        }

        // 4. Verify section subtitles, if present
        const subtitleCount = await articlePage.storySubtitles.count();

        for (let index = 0; index < subtitleCount; index++) {
            const subtitle = articlePage.storySubtitles.nth(index);

            await expect(subtitle).toBeVisible();
            await expect(subtitle).toHaveText(/\S/);
        }
    });

});
