import { type Page, type Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly clearIcon: Locator;
  readonly pageTitle: Locator;
  readonly tabStory: Locator;
  readonly tabVideoStory: Locator;
  readonly resultCards: Locator;
  readonly emptyStateContainer: Locator;
  readonly emptyStateHeadline: Locator;
  readonly popularSearchSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[data-qa-id="input-search"]');
    this.clearIcon = page.locator('img[data-qa-id="x-circle"]');
    this.pageTitle = page.locator('h1[data-qa-id="page-title"]');
    this.tabStory = page.locator('[data-qa-id="tab-story"]');
    this.tabVideoStory = page.locator('[data-qa-id="tab-video-story"]');
    this.resultCards = page.locator('[data-qa-id="story-result-card"]');
    this.emptyStateContainer = page.locator('[data-qa-id="story-not-found"]');
    this.emptyStateHeadline = this.emptyStateContainer.getByText('Story tidak ditemukan', { exact: true });
    this.popularSearchSection = page.locator('[data-qa-id="popular-search-section"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://kumparan.com/search', {
      waitUntil: 'domcontentloaded',
    });
  }

  async fillSearch(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async submitSearch(query: string): Promise<void> {
    await this.fillSearch(query);
    await this.searchInput.press('Enter');
  }

  async clickClear(): Promise<void> {
    await this.clearIcon.click();
  }

  getFirstResultCard(): Locator {
    return this.resultCards.first();
  }
}
