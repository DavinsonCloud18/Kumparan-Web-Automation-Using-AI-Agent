import { type Page, type Locator } from '@playwright/test';

export class TrendingPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly newsItems: Locator;
  readonly trendingCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1[data-qa-id="page-title"], h1');
    this.newsItems = page.locator('[data-qa-id="news-item"], a[aria-label="news-card-label-link"]');
    this.trendingCards = page.locator('[data-qa-id="trending-stories-card"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://kumparan.com/trending', {
      waitUntil: 'domcontentloaded',
    });
  }

  getFirstTrendingCard(): Locator {
    return this.trendingCards.first();
  }
}
