import { Page, Locator, expect } from '@playwright/test';
import { OrangeHRMLoginSelectors } from '../../selectors/orangehrm/login.selectors';

export class OrangeHRMLoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get usernameInput(): Locator { return this.page.locator(OrangeHRMLoginSelectors.usernameInput); }
    get passwordInput(): Locator { return this.page.locator(OrangeHRMLoginSelectors.passwordInput); }
    get loginButton(): Locator { return this.page.locator(OrangeHRMLoginSelectors.loginButton); }
    get errorMessage(): Locator { return this.page.locator(OrangeHRMLoginSelectors.errorMessage); }
    get dashboardHeader(): Locator { return this.page.locator(OrangeHRMLoginSelectors.dashboardHeader); }

    async goto() {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyDashboardLoaded() {
        await expect(this.dashboardHeader).toHaveText('Dashboard');
    }

    async verifyErrorMessage(message: string) {
        await expect(this.errorMessage).toContainText(message);
    }
}

