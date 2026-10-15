import { Page, Locator, expect } from '@playwright/test';
import { AdminSelectors } from '../../selectors/orangehrm/admin.selectors';

export class AdminPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async searchUser(username: string) {
        // Find the specific username input field in the search form
        const usernameInput = this.page.locator(AdminSelectors.searchUsernameInput).first();
        await usernameInput.fill(username);
        await this.page.getByRole('button', { name: 'Search', exact: true }).click();
    }

    async verifyRecordFound() {
        // Wait for search to complete and verify at least one record is found
        await expect(this.page.locator(AdminSelectors.tableRecords).first()).toBeVisible();
    }

    async verifyNoRecordsFound() {
        await expect(this.page.locator(AdminSelectors.tableRecords)).toHaveCount(0);
        await expect(this.page.locator('.oxd-text--span').getByText('No Records Found', { exact: true })).toBeVisible();
    }
}
