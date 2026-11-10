import { type Page, type Locator } from '@playwright/test';

export class BreakingNewsPage {
  readonly page: Page;
  readonly heroCards: Locator;
  readonly heroCard: Locator;
  readonly logo: Locator;
  readonly titles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroCards = page.locator('[data-qa-id="breaking-news-hero-card"]');
    this.heroCard = this.heroCards.first();
    this.logo = page.locator('[data-qa-id="breaking-news-logo"]');
    this.titles = page.locator('[data-qa-id="breaking-news-title"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://kumparan.com/breakingnews', {
      waitUntil: 'domcontentloaded',
    });
  }

  getFirstTitle(): Locator {
    return this.titles.first();
  }
}
