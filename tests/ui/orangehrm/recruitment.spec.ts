import { test, expect } from '@playwright/test';
import { SideMenuPage } from '../../../pages/orangehrm/SideMenuPage';
import { RecruitmentPage } from '../../../pages/orangehrm/RecruitmentPage';
import { OrangeHRMLoginPage } from '../../../pages/orangehrm/LoginPage';

test.describe('OrangeHRM Recruitment Module Tests', () => {
    let sideMenuPage: SideMenuPage;
    let recruitmentPage: RecruitmentPage;
    let loginPage: OrangeHRMLoginPage;

    test.beforeEach(async ({ page }) => {
        sideMenuPage = new SideMenuPage(page);
        recruitmentPage = new RecruitmentPage(page);
        loginPage = new OrangeHRMLoginPage(page);
        await loginPage.goto();
        await sideMenuPage.clickMenuItem('Recruitment');
    });

    test('User can add a new job candidate', async () => {
        await recruitmentPage.goToAddCandidate();
        await recruitmentPage.addCandidate('John', `Candidate${Date.now()}`, `john.doe.${Date.now()}@example.com`);
        await recruitmentPage.verifyCandidateSaved();
    });

    test('User sees required-field errors when candidate details are missing', async () => {
        await recruitmentPage.goToAddCandidate();
        await recruitmentPage.saveCandidate();
        await recruitmentPage.verifyRequiredFieldErrors();
    });
});
