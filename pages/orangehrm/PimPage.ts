import { Page, Locator, expect } from '@playwright/test';
import { PimSelectors } from '../../selectors/orangehrm/pim.selectors';

export class PimPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToAddEmployee() {
        await this.page.locator(PimSelectors.addEmployeeTab).click();
    }

    async goToEmployeeList() {
        await this.page.locator(PimSelectors.employeeListTab).click();
    }

    async addEmployee(firstName: string, lastName: string) {
        await this.page.locator(PimSelectors.firstNameInput).fill(firstName);
        await this.page.locator(PimSelectors.lastNameInput).fill(lastName);
        await this.page.locator(PimSelectors.saveButton).click();
    }

    async searchEmployee(name: string) {
        const searchInput = this.page.locator(PimSelectors.employeeNameSearchInput).first();
        await searchInput.fill(name);
        // Wait for autocomplete dropdown if needed, but clicking search might be enough
        await this.page.waitForTimeout(1000); 
        await this.page.locator(PimSelectors.searchButton).click();
    }

    async verifySuccessToast() {
        await expect(this.page.locator(PimSelectors.successToast).first()).toBeVisible({ timeout: 10000 });
    }

    async verifyPersonalDetailsLoaded() {
        await expect(this.page.locator('h6:has-text("Personal Details")').first()).toBeVisible({ timeout: 10000 });
    }

    async deleteFirstEmployeeInList() {
        await this.page.locator(PimSelectors.deleteButton).first().click();
        await this.page.locator(PimSelectors.confirmDeleteButton).click();
    }
}

