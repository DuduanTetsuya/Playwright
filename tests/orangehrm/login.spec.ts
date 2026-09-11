import { test, expect } from '@playwright/test';
import { OrangeHRMLoginPage } from '../../pages/orangehrm/LoginPage';

test.describe('OrangeHRM Login Tests', () => {
    let loginPage: OrangeHRMLoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new OrangeHRMLoginPage(page);
        await loginPage.goto();
    });

    test('User can login successfully with valid credentials', async () => {
        await loginPage.login(process.env.ORANGEHRM_USERNAME!, process.env.ORANGEHRM_PASSWORD!);
        await loginPage.verifyDashboardLoaded();
    });

    test('User should not able to login with invalid credentials', async () => {
        await loginPage.login('InvalidUser', 'InvalidPass');
        await loginPage.verifyErrorMessage('Invalid credentials');
    });
});

