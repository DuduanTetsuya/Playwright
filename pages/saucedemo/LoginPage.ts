import { Page, Locator, expect } from '@playwright/test';
import { LoginSelectors } from '../../selectors/saucedemo/login.selectors';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Getters
    get usernameInput(): Locator {
        return this.page.locator(LoginSelectors.usernameInput);
    }

    get passwordInput(): Locator {
        return this.page.locator(LoginSelectors.passwordInput);
    }

    get loginButton(): Locator {
        return this.page.locator(LoginSelectors.loginButton);
    }

    get errorMessage(): Locator {
        return this.page.locator(LoginSelectors.errorMessage);
    }

    get errorCloseButton(): Locator {
        return this.page.locator(LoginSelectors.errorCloseButton);
    }

    async goto() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async dismissError() {
        await this.errorCloseButton.click();
    }

    // Assertions
    async verifyPasswordIsMasked() {
        await expect(this.passwordInput).toHaveAttribute('type', 'password');
    }

    async verifyErrorMessage(expectedMessage: string) {
        await expect(this.errorMessage).toContainText(expectedMessage);
    }

    async verifyErrorDismissed() {
        await expect(this.errorMessage).toBeHidden();
    }
}
