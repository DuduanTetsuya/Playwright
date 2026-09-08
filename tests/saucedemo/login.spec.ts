import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.goto();
    });

    test('User can login successfully with valid credentials', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPageLoaded();
    });

    test('User should not able to login with locked out user', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        await loginPage.verifyErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    });

    test('User should not able to login with invalid credentials', async () => {
        await loginPage.login('invalid_user', 'wrong_password');
        await loginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service');
    });

    test('User should not able to login with empty username', async () => {
        await loginPage.login('', 'secret_sauce');
        await loginPage.verifyErrorMessage('Epic sadface: Username is required');
    });

    test('User should not able to login with empty password', async () => {
        await loginPage.login('standard_user', '');
        await loginPage.verifyErrorMessage('Epic sadface: Password is required');
    });
});

