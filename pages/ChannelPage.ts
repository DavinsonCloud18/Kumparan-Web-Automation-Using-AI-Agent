import { type Page, type Locator } from '@playwright/test';

export class ChannelPage {
  readonly page: Page;
  readonly channelTitle: Locator;
  readonly channelArticles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.channelTitle = page.locator('h1[data-qa-id="channel-title"]');
    this.channelArticles = page.locator('[data-qa-id="news-item"], a[aria-label="news-card-label-link"]');
  }

  getFirstArticle(): Locator {
    return this.channelArticles.first();
  }
}
