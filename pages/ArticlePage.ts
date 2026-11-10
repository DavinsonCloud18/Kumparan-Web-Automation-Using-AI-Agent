
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
    }
}
