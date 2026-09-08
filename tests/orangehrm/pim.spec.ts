import { test, expect } from '@playwright/test';
import { SideMenuPage } from '../../pages/orangehrm/SideMenuPage';
import { PimPage } from '../../pages/orangehrm/PimPage';
import { loginAsAdmin } from '../../helpers/orangehrm/auth.helper';

test.describe('OrangeHRM PIM Module Tests', () => {
    let sideMenuPage: SideMenuPage;
    let pimPage: PimPage;

    const testFirstName = 'Automated';
    const testLastName = 'QA User';

    test.beforeEach(async ({ page }) => {
        sideMenuPage = new SideMenuPage(page);
        pimPage = new PimPage(page);
        
        await loginAsAdmin(page);
        await sideMenuPage.clickMenuItem('PIM');
    });

    test('User can add a new employee', async () => {
        await pimPage.goToAddEmployee();
        await pimPage.addEmployee(testFirstName, testLastName);
        await pimPage.verifyPersonalDetailsLoaded();
    });

    test('User can search and delete an employee', async () => {
        await pimPage.goToEmployeeList();
        await pimPage.searchEmployee(testFirstName);
        
        // Ensure there is at least one row, then delete
        await pimPage.deleteFirstEmployeeInList();
        await pimPage.verifySuccessToast();
    });
});

