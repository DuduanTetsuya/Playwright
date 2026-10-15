import { Page, Locator, expect } from '@playwright/test';
import { LeaveSelectors } from '../../selectors/orangehrm/leave.selectors';

export class LeavePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToApplyLeave() {
        await this.page.locator(LeaveSelectors.applyTab).click();
    }

    async goToLeaveList() {
        await this.page.locator(LeaveSelectors.leaveListTab).click();
    }

    async verifyLeaveListLoaded() {
        await expect(this.page.locator('h5:has-text("Leave List")').first()).toBeVisible();
    }

    async verifyApplyLeavePageLoaded() {
        const noBalanceMessage = this.page.getByText('No Leave Types with Leave Balance', { exact: true });
        const leaveTypeField = this.page.locator('.oxd-input-group').filter({ hasText: 'Leave Type' });
        await expect(noBalanceMessage.or(leaveTypeField).first()).toBeVisible({ timeout: 30000 });
    }
}
