import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly brandLogo: Locator;
  readonly channelNavigation: Locator;
  readonly searchInput: Locator;
  readonly articleCards: Locator;
  readonly standardEditorialCards: Locator;
  readonly firstStandardArticleLink: Locator;
  readonly firstStandardArticleTitle: Locator;
  readonly themeToggleButton: Locator;
  readonly moonIcon: Locator;
  readonly sunIcon: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandLogo = page.locator('a[data-qa-id="hd-logo"]');
    this.channelNavigation = page.locator('nav[data-qa-id="main-menu"]');
    this.searchInput = page.locator('input[data-qa-id="input-search"]');
    this.themeToggleButton = page.locator('button[data-qa-id="hd-theme"]');
    this.moonIcon = this.themeToggleButton.locator('img[data-qa-id="moon"], img[alt="moon"]');
    this.sunIcon = this.themeToggleButton.locator('img[data-qa-id="sun"], img[alt="sun"]');
    this.loginButton = page.locator('button[data-qa-id="hd-login"]');
    this.articleCards = page.locator('a[aria-label="news-card-label-link"]');
    this.standardEditorialCards = this.articleCards
      .filter({
        hasNot: page.locator('[data-qa-id="news-card-gallery-v2"]'),
      })
      .filter({
        hasNot: page.locator('[data-qa-id="news-card-video-v2"]'),
      })
      .filter({
        hasNot: page.locator('text=/^Polling:/'),
      });

    this.firstStandardArticleLink = this.standardEditorialCards.first();

    this.firstStandardArticleTitle =
      this.firstStandardArticleLink.locator('[data-qa-id="title"]');

  }

  async goto(): Promise<void> {
    await this.page.goto('https://kumparan.com/', {
      waitUntil: 'domcontentloaded',
    });
  }

  getFirstArticleCard(): Locator {
    return this.articleCards.first();
  }

  async navigateToChannel(channel: string): Promise<void> {
    await this.channelNavigation
      .getByRole('link', { name: channel, exact: true })
      .click();
  }

  async clickSearchInput(): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.searchInput.click();
  }

  async search(keyword: string): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.searchInput.click();
    await this.searchInput.fill(keyword);
    await this.searchInput.press('Enter');
  }

  async toggleTheme(): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.themeToggleButton.click();
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  getFirstStandardArticle(): Locator {
    return this.standardEditorialCards.first();
  }
}