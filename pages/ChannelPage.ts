import { type Page, type Locator } from '@playwright/test';

export class ChannelPage {
  readonly page: Page;
  readonly channelTitle: Locator;
  readonly mobileTrendingTitle: Locator;
  readonly channelArticles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.channelTitle = page.locator('h1[data-qa-id="channel-title"]');
    this.mobileTrendingTitle = page.locator('h2[data-qa-id="title"]');
    this.channelArticles = page.locator('[data-qa-id="news-item"], a[aria-label="news-card-label-link"]');
  }

  getFirstArticle(): Locator {
    return this.channelArticles.first();
  }
}
