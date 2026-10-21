import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../../pages/saucedemo/InventoryPage';
import { sauceDemoInvalidCredentials, sauceDemoLoginFailureCases } from '../../../testdata/saucedemo-login.data';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.goto();
    });

    test('User can login successfully with valid credentials', { tag: '@smoke' }, async () => {
        await loginPage.login(process.env.SAUCEDEMO_USERNAME!, process.env.SAUCEDEMO_PASSWORD!);
        await inventoryPage.verifyInventoryPageLoaded();
    });

    for (const loginCase of sauceDemoLoginFailureCases) {
        test(loginCase.name, async () => {
            await loginPage.login(loginCase.username, loginCase.password);
            await loginPage.verifyErrorMessage(loginCase.expectedError);
        });
    }

    test('User should not able to login with empty password', async () => {
        await loginPage.login(process.env.SAUCEDEMO_USERNAME!, '');
        await loginPage.verifyErrorMessage('Epic sadface: Password is required');
    });

    test('Password field masks entered credentials', async () => {
        await loginPage.passwordInput.fill('secret_sauce');
        await loginPage.verifyPasswordIsMasked();
    });

    test('User can dismiss a login error message', async () => {
        await loginPage.login(sauceDemoInvalidCredentials.username, sauceDemoInvalidCredentials.password);
        await loginPage.verifyErrorMessage(sauceDemoInvalidCredentials.expectedError);
        await loginPage.dismissError();
        await loginPage.verifyErrorDismissed();
    });
});
