import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { PimPage } from "../pages/PimPage";
import config from '../config/config.json';

test('Admin Page test', async ({page}) => {
    const loginPage = new LoginPage(page);
    const pimPage = new PimPage(page);
    const validUsername = config.validUsername;
    const validPassword = config.validPassword;

    await test.step('Login', async () => {
        await loginPage.visit();
        await loginPage.login(validUsername, validPassword);
    })

    await test.step('Go to PIM', async () => {
        await pimPage.goToPim();
        await pimPage.assertPimPage();
    })
})