import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggle: Locator;
  readonly eyeIcon: Locator;
  readonly eyeOffIcon: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[data-qa-id="input-email"]');
    this.passwordInput = page.locator('input[data-qa-id="input-password"]');
    this.passwordToggle = page.locator('[data-qa-id="right-add-on"] button');
    this.eyeIcon = this.passwordToggle.locator('img[data-qa-id="eye"], img[alt="eye"]');
    this.eyeOffIcon = this.passwordToggle.locator('img[data-qa-id="eye-off"], img[alt="eye-off"]');
    this.submitButton = page.locator('button[data-qa-id="btn-save"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://kumparan.com/login', {
      waitUntil: 'domcontentloaded',
    });
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.passwordToggle.click();
  }

  async clickSubmit(options?: { force?: boolean }): Promise<void> {
    await this.submitButton.click(options);
  }
}



