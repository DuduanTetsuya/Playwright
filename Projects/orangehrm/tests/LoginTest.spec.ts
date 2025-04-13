import { LoginPage } from "../pages/LoginPage";
import { test } from '@playwright/test'
import config from '../config/config.json';

test.describe('OrangeHRM Login test', () => {
    let loginPage: LoginPage;
    const validUsername = config.validUsername;
    const validPassword = config.validPassword;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await loginPage.visit();
    })

    test('Valid credential should success', async ({page}) => {
        await loginPage.login(validUsername, validPassword);
        await loginPage.assertLoginSuccess();
    })

    test('Invalid credential should error', async ({page}) => {
        await loginPage.login('Admin', 'wrongpassword');
        await loginPage.assertLoginFailed();
        await page.pause();
    })
})