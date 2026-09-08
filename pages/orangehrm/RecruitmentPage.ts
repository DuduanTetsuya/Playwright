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
        await this.page.locator(RecruitmentSelectors.saveButton).click();
    }

    async verifySuccessToast() {
        await expect(this.page.locator(RecruitmentSelectors.successToast).first()).toBeVisible({ timeout: 10000 });
    }

    async verifyApplicationStageLoaded() {
        await expect(this.page.locator('h6:has-text("Application Stage")').first()).toBeVisible({ timeout: 10000 });
    }
}

