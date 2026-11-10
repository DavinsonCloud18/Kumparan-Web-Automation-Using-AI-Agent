import { type Page, type Locator } from '@playwright/test';

export class CommentPage {
  readonly page: Page;
  readonly commentSection: Locator;
  readonly commentInputCard: Locator;
  readonly commentTextarea: Locator;
  readonly sendButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.commentSection = page.locator('section[data-qa-id="comment-section"]');
    this.commentInputCard = page.locator('div[data-qa-id="comment-input-card"]');
    this.commentTextarea = page.locator('div[data-qa-id="input-comment"] textarea, textarea[placeholder="Tulis komentar..."]');
    this.sendButton = page.locator('button[data-qa-id="btn-send-comment"]');
  }

  async fillComment(text: string): Promise<void> {
    await this.commentTextarea.fill(text);
  }

  async clickSend(): Promise<void> {
    await this.sendButton.click();
  }

  async submitComment(text: string): Promise<void> {
    await this.fillComment(text);
    await this.clickSend();
  }
}

