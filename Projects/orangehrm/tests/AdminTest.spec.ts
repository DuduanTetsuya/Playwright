import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AdminPage } from "../pages/AdminPage";
import config from '../config/config.json';

test('Admin Page test', async ({page}) => {
    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);
    const validUsername = config.validUsername;
    const validPassword = config.validPassword;

    await test.step('Login', async () => {
        await loginPage.visit();
        await loginPage.login(validUsername, validPassword);
    })

    await test.step('Go to User Management - Users', async () => {
        await adminPage.goToAdmin();
        await adminPage.assertAdminPage();
        await adminPage.goToUserManagement_Users();
        await adminPage.assertUserManagement_Users();
    })

    await test.step('Add new user', async () => {
        await adminPage.addNewUser('duduantetsuya', 'Password123', 'Admin', 'Enabled');
        await adminPage.assertUserExist('duduantetsuya');
    })

    await test.step('Delete user', async () => {
        await adminPage.deleteUser('duduantetsuya');
        await adminPage.assertUserNotExist('duduantetsuya');
    })
})