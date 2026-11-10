
import { type Page, type Locator } from '@playwright/test';

export class ArticlePage {
    readonly page: Page;
    readonly storyTitle: Locator;
    readonly homeBreadcrumb: Locator;
    readonly channelBreadcrumb: Locator;
    readonly commentTrigger: Locator;
    readonly pollingTitle: Locator;
    readonly pollingChoices: Locator;
    readonly pollingOptionButtons: Locator;

    constructor(page: Page) {
        this.page = page;

        this.storyTitle = page.locator(
            'h1[data-qa-id="story-title"]'
        );

        this.homeBreadcrumb = page.locator(
            'a[data-qa-id="home-breadcrumb"]'
        );

        this.channelBreadcrumb = page.locator(
            'a[data-qa-id="channel-name"]'
        );

        this.commentTrigger = page.locator(
            'a[data-qa-id="btn-comment"]'
        );

        this.pollingTitle = page.locator(
            'h2[data-qa-id="polling-title"]'
        );

        this.pollingChoices = page.locator(
            '[data-qa-id="polling-choice"]'
        );

        this.pollingOptionButtons = page.locator(
            '[data-qa-id="polling-choice"] button'
        );
    }

    async clickComment(): Promise<void> {
        await this.commentTrigger.click();
    }

    async clickFirstPollingOption(): Promise<void> {
        await this.pollingOptionButtons.first().waitFor({ state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(1000);
        await this.pollingOptionButtons.first().click({ force: true });
    }
}
