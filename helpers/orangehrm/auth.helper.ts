import { Page } from '@playwright/test';
import { OrangeHRMLoginPage } from '../../pages/orangehrm/LoginPage';

export async function loginAsAdmin(page: Page) {
    const loginPage = new OrangeHRMLoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await loginPage.verifyDashboardLoaded();
}

