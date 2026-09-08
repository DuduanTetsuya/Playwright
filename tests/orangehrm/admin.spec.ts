import { test, expect } from '@playwright/test';
import { SideMenuPage } from '../../pages/orangehrm/SideMenuPage';
import { AdminPage } from '../../pages/orangehrm/AdminPage';
import { loginAsAdmin } from '../../helpers/orangehrm/auth.helper';

test.describe('OrangeHRM Admin Module Tests', () => {
    let sideMenuPage: SideMenuPage;
    let adminPage: AdminPage;

    test.beforeEach(async ({ page }) => {
        sideMenuPage = new SideMenuPage(page);
        adminPage = new AdminPage(page);
        
        await loginAsAdmin(page);
        await sideMenuPage.clickMenuItem('Admin');
    });

    test('User can search for an existing admin user', async () => {
        await adminPage.searchUser('Admin');
        await adminPage.verifyRecordFound();
    });
});

