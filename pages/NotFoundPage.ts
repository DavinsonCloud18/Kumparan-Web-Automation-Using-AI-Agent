import { type Page, type Locator } from '@playwright/test';

export class NotFoundPage {
  readonly page: Page;
  readonly container: Locator;
  readonly errorMessage: Locator;
  readonly errorSubtitle: Locator;
  readonly backToHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('div[data-qa-id="not-found-page"]');
    this.errorMessage = this.container.getByText('Maaf, halaman tidak ditemukan');
    this.errorSubtitle = this.container.getByText('Tapi tenang, masih banyak konten menarik lainnya');
    this.backToHomeButton = page.locator('a[data-qa-id="back-to-home"]');
  }

  async goto(url: string = 'https://kumparan.com/trendingssds'): Promise<void> {
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
    });
  }

  async clickBackToHome(): Promise<void> {
    await this.backToHomeButton.click();
  }
}

