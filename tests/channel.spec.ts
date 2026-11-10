import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ChannelPage } from '../pages/ChannelPage';

test.describe('Channel Navigation Test Suite', () => {

    test('TC-NAV-001: Verify Navigation from Homepage to Tekno Channel', async ({ page }) => {

        // Arrange
        const homePage = new HomePage(page);
        const channelPage = new ChannelPage(page);

        // Act
        await homePage.goto();

        await expect(homePage.channelNavigation).toBeVisible();

        await homePage.navigateToChannel('Tekno');

        // Assert: URL
        await expect(page).toHaveURL(/\/channel\/tekno$/);

        // Assert: Page title
        await expect(page).toHaveTitle(/Teknologi.*kumparan/i);

        // Assert: Channel heading
        await expect(channelPage.channelTitle).toBeVisible();
        await expect(channelPage.channelTitle).toHaveText('Tekno');

        // Assert: Channel feed
        await expect(channelPage.channelArticles.first()).toBeVisible();
    });

});