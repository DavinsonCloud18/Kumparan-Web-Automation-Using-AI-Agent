
import { type Page, type Locator } from '@playwright/test';

export class ArticlePage {
    readonly page: Page;
    readonly storyTitle: Locator;
    readonly authorName: Locator;
    readonly publishDate: Locator;
    readonly readingTime: Locator;
    readonly storyParagraphs: Locator;
    readonly articleMain: Locator;
    readonly imageFigures: Locator;
    readonly storySubtitles: Locator;
    readonly homeBreadcrumb: Locator;
    readonly channelBreadcrumb: Locator;
    readonly commentTrigger: Locator;
    readonly floatingActionBar: Locator;
    readonly likeButton: Locator;
    readonly pollingTitle: Locator;
    readonly pollingChoices: Locator;
    readonly pollingOptionButtons: Locator;

    constructor(page: Page) {
        this.page = page;

        this.storyTitle = page.locator(
            'h1[data-qa-id="story-title"]'
        );

        this.authorName = page.locator(
            'header[data-qa-id="story-author"] [data-qa-id="author-name"]'
        );

        this.publishDate = page.locator(
            'time[data-qa-id="publish-date"]'
        );

        this.readingTime = page.locator(
            'span[data-qa-id="reading-time"]'
        );

        this.articleMain = page.locator(
            'main[data-qa-id="article-main"]'
        );

        this.storyParagraphs = this.articleMain.locator(
            'p[data-qa-id="story-paragraph"]'
        );

        this.imageFigures = this.articleMain.locator(
            'figure[data-qa-id="image-figure"]'
        );

        this.storySubtitles = this.articleMain.locator(
            'h2[data-qa-id="story-subtitle"]'
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

        this.floatingActionBar = page.locator(
            'aside.sc-1ptwfhr-0'
        );

        this.likeButton = page.locator(
            'button[data-qa-id="btn-like"]'
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
        await this.pollingOptionButtons.first().click();
    }
}
