import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly brandLogo: Locator;
  readonly channelNavigation: Locator;
  readonly subMenuNavigation: Locator;
  readonly searchInput: Locator;
  readonly mobileSearchButton: Locator;
  readonly articleCards: Locator;
  readonly standardEditorialCards: Locator;
  readonly firstStandardArticleLink: Locator;
  readonly firstStandardArticleTitle: Locator;
  readonly themeToggleButton: Locator;
  readonly moonIcon: Locator;
  readonly sunIcon: Locator;
  readonly loginButton: Locator;
  readonly userAvatar: Locator;
  readonly logoutButton: Locator;
  readonly burgerMenuButton: Locator;
  readonly hamburgerIcon: Locator;
  readonly closeSidebarButton: Locator;
  readonly drawerLoginButton: Locator;
  readonly drawerLogoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandLogo = page.locator('[data-qa-id="hd-logo"]');
    this.channelNavigation = page.locator('nav[data-qa-id="main-menu"]');
    this.subMenuNavigation = page.locator('header[data-qa-id="header-section"] nav[aria-label="header sub menu"]');
    this.searchInput = page.locator('input[data-qa-id="input-search"]');
    this.mobileSearchButton = page.locator('a[data-qa-id="hd-search"]');
    this.themeToggleButton = page.locator('button[data-qa-id="hd-theme"]');
    this.moonIcon = this.themeToggleButton.locator('img[data-qa-id="moon"], img[alt="moon"]');
    this.sunIcon = this.themeToggleButton.locator('img[data-qa-id="sun"], img[alt="sun"]');
    this.loginButton = page.locator('button[data-qa-id="hd-login"]');
    this.userAvatar = page.locator('div[data-qa-id="hd-pic-user"].avsmini');
    this.logoutButton = page.locator('a[data-qa-id="log-out"]');
    this.burgerMenuButton = page.locator('button[data-qa-id="burger-menu"]');
    this.hamburgerIcon = page.locator('img[data-qa-id="hamburger-menu"]');
    this.closeSidebarButton = page.locator('button[data-qa-id="close-sidebar"]');
    this.drawerLoginButton = page.locator('[data-qa-id="label-list-item-masuk"]');
    this.drawerLogoutButton = page.locator('[data-qa-id="log-out"]');
    this.articleCards = page.locator('a[aria-label="news-card-label-link"]');
    this.standardEditorialCards = this.articleCards.filter({
      hasNotText: 'Polling:',
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
    const mobileChannelLink = this.page.locator(`a[data-qa-id="topnav"]:has-text("${channel}")`);
    if (await mobileChannelLink.isVisible()) {
      await mobileChannelLink.click();
      return;
    }
    await this.channelNavigation
      .getByRole('link', { name: channel, exact: true })
      .click();
  }

  async clickHighlightedMenu(menuName: string): Promise<void> {
    const mobileTopNews = this.page.locator(`a[data-qa-id="nb-top-news"]:has-text("${menuName}")`);
    if (await mobileTopNews.isVisible()) {
      await mobileTopNews.click();
      return;
    }
    await this.subMenuNavigation
      .getByRole('link', { name: menuName, exact: true })
      .click();
  }

  async clickSearchInput(): Promise<void> {
    await this.page.waitForLoadState('load');
    if (await this.mobileSearchButton.isVisible()) {
      await this.mobileSearchButton.click();
      return;
    }
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

  async openBurgerMenu(): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.burgerMenuButton.tap();
    await this.page.waitForFunction(() => {
      const el = document.querySelector('[data-qa-id="label-list-item-masuk"]') || document.querySelector('[data-qa-id="log-out"]');
      return el && (el as HTMLElement).getBoundingClientRect().x >= 0;
    }, { timeout: 10000 }).catch(async () => {
      // Retry tap if initial hydration race occurred
      await this.burgerMenuButton.tap();
    });
  }

  async closeBurgerMenu(): Promise<void> {
    await this.closeSidebarButton.tap();
  }

  async clickDrawerLogin(): Promise<void> {
    await this.drawerLoginButton.tap();
  }

  async clickDrawerLogout(): Promise<void> {
    await this.drawerLogoutButton.tap();
  }

  async clickUserAvatar(): Promise<void> {
    await this.userAvatar.click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }

  async logout(): Promise<void> {
    await this.clickUserAvatar();
    await this.clickLogout();
  }

  getFirstStandardArticle(): Locator {
    return this.standardEditorialCards.first();
  }
}