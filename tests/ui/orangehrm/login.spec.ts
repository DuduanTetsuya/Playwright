import { test, expect } from '@playwright/test';
import { OrangeHRMLoginPage } from '../../../pages/orangehrm/LoginPage';
import { orangeHrmLoginFailureCases } from '../../../testdata/orangehrm-login.data';

test.describe('OrangeHRM Login Tests', () => {
    let loginPage: OrangeHRMLoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new OrangeHRMLoginPage(page);
        await loginPage.goto();
    });

    test('User can login successfully with valid credentials', { tag: '@smoke' }, async () => {
        await loginPage.login(process.env.ORANGEHRM_USERNAME!, process.env.ORANGEHRM_PASSWORD!);
        await loginPage.verifyDashboardLoaded();
    });

    for (const loginCase of orangeHrmLoginFailureCases) {
        test(loginCase.name, async () => {
            await loginPage.login(loginCase.username, loginCase.password);
            await loginPage.verifyErrorMessage(loginCase.expectedError);
        });
    }
});
