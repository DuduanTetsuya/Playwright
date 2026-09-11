import { test, expect } from '@playwright/test';
import { SideMenuPage } from '../../pages/orangehrm/SideMenuPage';
import { LeavePage } from '../../pages/orangehrm/LeavePage';
import { OrangeHRMLoginPage } from '../../pages/orangehrm/LoginPage';

test.describe('OrangeHRM Leave Module Tests', () => {
    let sideMenuPage: SideMenuPage;
    let leavePage: LeavePage;
    let loginPage: OrangeHRMLoginPage;

    test.beforeEach(async ({ page }) => {
        sideMenuPage = new SideMenuPage(page);
        leavePage = new LeavePage(page);
        loginPage = new OrangeHRMLoginPage(page);
        await loginPage.goto();
        await sideMenuPage.clickMenuItem('Leave');
    });

    test('User can navigate to Leave List', async () => {
        await leavePage.goToLeaveList();
        await leavePage.verifyLeaveListLoaded();
    });
});

