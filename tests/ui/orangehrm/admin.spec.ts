import { test, expect } from '@playwright/test';
import { SideMenuPage } from '../../../pages/orangehrm/SideMenuPage';
import { AdminPage } from '../../../pages/orangehrm/AdminPage';
import { OrangeHRMLoginPage } from '../../../pages/orangehrm/LoginPage';

test.describe('OrangeHRM Admin Module Tests', () => {
    let sideMenuPage: SideMenuPage;
    let adminPage: AdminPage;
    let loginPage: OrangeHRMLoginPage;

    test.beforeEach(async ({ page }) => {
        sideMenuPage = new SideMenuPage(page);
        adminPage = new AdminPage(page);
        loginPage = new OrangeHRMLoginPage(page);
        await loginPage.goto();
        await sideMenuPage.clickMenuItem('Admin');
    });

    test('User can search for an existing admin user', async () => {
        await adminPage.searchUser('Admin');
        await adminPage.verifyRecordFound();
    });

    test('User sees no records when searching for a nonexistent username', async () => {
        await adminPage.searchUser(`missing-user-${Date.now()}`);
        await adminPage.verifyNoRecordsFound();
    });
});
