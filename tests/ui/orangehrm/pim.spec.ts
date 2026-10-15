import { test, expect } from '@playwright/test';
import { SideMenuPage } from '../../../pages/orangehrm/SideMenuPage';
import { PimPage } from '../../../pages/orangehrm/PimPage';
import { OrangeHRMLoginPage } from '../../../pages/orangehrm/LoginPage';

test.describe('OrangeHRM PIM Module Tests', () => {
    test.describe.configure({ timeout: 60000 });

    let sideMenuPage: SideMenuPage;
    let pimPage: PimPage;
    let loginPage: OrangeHRMLoginPage;

    test.beforeEach(async ({ page }) => {
        sideMenuPage = new SideMenuPage(page);
        pimPage = new PimPage(page);
        loginPage = new OrangeHRMLoginPage(page);
        await loginPage.goto();
        await sideMenuPage.clickMenuItem('PIM');
    });

    test('User can add a new employee', async () => {
        const firstName = `Automated${Date.now()}`;
        const lastName = 'QA User';
        const employeeId = String(Date.now()).slice(-8);

        await pimPage.goToAddEmployee();
        await pimPage.addEmployee(firstName, lastName, employeeId);
        await pimPage.verifyPersonalDetailsLoaded();
        await pimPage.verifyEmployeeDetails(firstName, lastName);
    });

    test('User sees required-field errors when adding an employee without required details', async () => {
        await pimPage.goToAddEmployee();
        await pimPage.setEmployeeId(String(Date.now()).slice(-8));
        await pimPage.saveEmployee();
        await pimPage.verifyRequiredFieldErrors(2);
    });

    test('User can search for and delete the employee they created', async () => {
        const firstName = `Delete${Date.now()}`;
        const lastName = 'QA User';
        const employeeId = String(Date.now()).slice(-8);

        await pimPage.goToAddEmployee();
        await pimPage.addEmployee(firstName, lastName, employeeId);
        await pimPage.verifyPersonalDetailsLoaded();

        await pimPage.goToEmployeeList();
        await pimPage.searchEmployee(`${firstName} ${lastName}`);
        await pimPage.verifyEmployeeFound(`${firstName} ${lastName}`);
        await pimPage.deleteEmployee(`${firstName} ${lastName}`);
        await pimPage.verifyNoEmployeesFound();
    });
});
