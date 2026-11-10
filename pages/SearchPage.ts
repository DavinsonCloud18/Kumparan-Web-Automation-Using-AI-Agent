import { type Page, type Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly tabStory: Locator;
  readonly tabVideoStory: Locator;
  readonly tabKumparanPlus: Locator;
  readonly tabTopic: Locator;
  readonly tabUser: Locator;
  readonly tabPublisher: Locator;
  readonly resultCards: Locator;
  readonly emptyStateContainer: Locator;
  readonly emptyStateHeadline: Locator;
  readonly emptyStateSubHeadline: Locator;
  readonly popularSearchSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1[data-qa-id="page-title"]');
    this.tabStory = page.locator('[data-qa-id="tab-story"]');
    this.tabVideoStory = page.locator('[data-qa-id="tab-video-story"]');
    this.tabKumparanPlus = page.locator('[data-qa-id="tab-kumparan_plus"]');
    this.tabTopic = page.locator('[data-qa-id="tab-topic"]');
    this.tabUser = page.locator('[data-qa-id="tab-user"]');
    this.tabPublisher = page.locator('[data-qa-id="tab-publisher"]');
    this.resultCards = page.locator('[data-qa-id="story-result-card"]');
    this.emptyStateContainer = page.locator('[data-qa-id="story-not-found"]');
    this.emptyStateHeadline = this.emptyStateContainer.getByText('Story tidak ditemukan', { exact: true });
    this.emptyStateSubHeadline = this.emptyStateContainer.getByText('Sudah benarkah story yang dicari?', { exact: true });
    this.popularSearchSection = page.locator('[data-qa-id="popular-search-section"]');
  }

  getFirstResultCard(): Locator {
    return this.resultCards.first();
  }
}

