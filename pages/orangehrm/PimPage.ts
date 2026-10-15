import { Page, Locator, expect } from '@playwright/test';
import { PimSelectors } from '../../selectors/orangehrm/pim.selectors';

export class PimPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToAddEmployee() {
        await this.page.locator(PimSelectors.addEmployeeTab).click();
        await expect(this.page.locator(PimSelectors.firstNameInput)).toBeVisible({ timeout: 45000 });
    }

    async goToEmployeeList() {
        await this.page.locator(PimSelectors.employeeListTab).click();
    }

    async addEmployee(firstName: string, lastName: string, employeeId: string) {
        await this.page.locator(PimSelectors.firstNameInput).fill(firstName);
        await this.page.locator(PimSelectors.lastNameInput).fill(lastName);
        await this.setEmployeeId(employeeId);
        await this.saveEmployee();
    }

    async setEmployeeId(employeeId: string) {
        await this.page.locator(PimSelectors.employeeIdInput).fill(employeeId);
    }

    async saveEmployee() {
        await this.page.locator(PimSelectors.saveButton).click();
    }

    async searchEmployee(name: string) {
        const searchInput = this.page.locator(PimSelectors.employeeNameSearchInput).first();
        await searchInput.fill(name);
        const suggestion = this.page.locator('.oxd-autocomplete-option').filter({ hasText: name });
        await expect(suggestion.first()).toBeVisible({ timeout: 30000 });
        await suggestion.first().click();
        await this.page.locator(PimSelectors.searchButton).click();
    }

    async verifyEmployeeFound(name: string) {
        await expect(this.page.locator(PimSelectors.searchResultsTable).locator('.oxd-table-card').filter({ hasText: name })).toBeVisible();
    }

    async verifyNoEmployeesFound() {
        await expect(this.page.locator(PimSelectors.searchResultsTable).locator('.oxd-table-card')).toHaveCount(0);
    }

    async deleteEmployee(name: string) {
        const employeeRow = this.page.locator(PimSelectors.searchResultsTable).locator('.oxd-table-card').filter({ hasText: name });
        await employeeRow.locator(PimSelectors.deleteButton).click();
        await this.page.locator(PimSelectors.confirmDeleteButton).click();
    }

    async verifySuccessToast() {
        await expect(this.page.locator(PimSelectors.successToast).first()).toBeVisible({ timeout: 10000 });
    }

    async verifyPersonalDetailsLoaded() {
        await expect(this.page.locator('h6:has-text("Personal Details")').first()).toBeVisible({ timeout: 10000 });
    }

    async verifyEmployeeDetails(firstName: string, lastName: string) {
        await expect(this.page.locator(PimSelectors.firstNameInput)).toHaveValue(firstName);
        await expect(this.page.locator(PimSelectors.lastNameInput)).toHaveValue(lastName);
    }

    async verifyRequiredFieldErrors(expectedCount: number) {
        const errors = this.page.locator('.oxd-input-field-error-message');
        await expect(errors).toHaveCount(expectedCount);
        await expect(errors.first()).toHaveText('Required');
    }
}
