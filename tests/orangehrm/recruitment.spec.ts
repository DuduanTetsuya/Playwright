import { test, expect } from '@playwright/test';
import { SideMenuPage } from '../../pages/orangehrm/SideMenuPage';
import { RecruitmentPage } from '../../pages/orangehrm/RecruitmentPage';
import { loginAsAdmin } from '../../helpers/orangehrm/auth.helper';

test.describe('OrangeHRM Recruitment Module Tests', () => {
    let sideMenuPage: SideMenuPage;
    let recruitmentPage: RecruitmentPage;

    test.beforeEach(async ({ page }) => {
        sideMenuPage = new SideMenuPage(page);
        recruitmentPage = new RecruitmentPage(page);
        
        await loginAsAdmin(page);
        await sideMenuPage.clickMenuItem('Recruitment');
    });

    test('User can add a new job candidate', async () => {
        await recruitmentPage.goToAddCandidate();
        await recruitmentPage.addCandidate('John', 'Doe Candidate', 'john.doe@example.com');
        await recruitmentPage.verifyApplicationStageLoaded();
    });
});

