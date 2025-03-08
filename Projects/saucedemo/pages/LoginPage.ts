import { Page, expect } from "@playwright/test";
import locators from './locators.json';

export class LoginPage {
  private page: Page;
  private usernameInput = locators.loginPage.usernameField;
  private passwordInput = locators.loginPage.passwordField;
  private loginButton = locators.loginPage.loginButton;
  private errorMessage = locators.loginPage.errorMessage;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/");
    //Assert
    await expect(this.page.getByText('Swag Labs')).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return (await this.page.textContent(this.errorMessage)) ?? "";
  }
}
