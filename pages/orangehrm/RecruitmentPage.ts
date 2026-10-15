import { Page, Locator, expect } from '@playwright/test';
import { RecruitmentSelectors } from '../../selectors/orangehrm/recruitment.selectors';

export class RecruitmentPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToAddCandidate() {
        await this.page.locator(RecruitmentSelectors.addCandidateButton).click();
    }

    async addCandidate(firstName: string, lastName: string, email: string) {
        await this.page.locator(RecruitmentSelectors.firstNameInput).fill(firstName);
        await this.page.locator(RecruitmentSelectors.lastNameInput).fill(lastName);
        await this.page.locator(RecruitmentSelectors.emailInput).first().fill(email);
        await this.saveCandidate();
    }

    async saveCandidate() {
        await this.page.locator(RecruitmentSelectors.saveButton).click();
    }

    async verifySuccessToast() {
        await expect(this.page.locator(RecruitmentSelectors.successToast).first()).toBeVisible({ timeout: 10000 });
    }

    async verifyCandidateSaved() {
        await expect(this.page.locator(RecruitmentSelectors.successToast).first()).toContainText('Successfully Saved', { timeout: 10000 });
    }

    async verifyRequiredFieldErrors() {
        const errors = this.page.locator('.oxd-input-field-error-message');
        await expect(errors.first()).toHaveText('Required');
        await expect(errors.nth(1)).toHaveText('Required');
    }
}
