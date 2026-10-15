import { Page, Locator, expect } from '@playwright/test';
import { CheckoutSelectors } from '../../selectors/saucedemo/checkout.selectors';

export class CheckoutPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get firstNameInput(): Locator { return this.page.locator(CheckoutSelectors.firstNameInput); }
    get lastNameInput(): Locator { return this.page.locator(CheckoutSelectors.lastNameInput); }
    get postalCodeInput(): Locator { return this.page.locator(CheckoutSelectors.postalCodeInput); }
    get continueButton(): Locator { return this.page.locator(CheckoutSelectors.continueButton); }
    get finishButton(): Locator { return this.page.locator(CheckoutSelectors.finishButton); }
    get backHomeButton(): Locator { return this.page.locator(CheckoutSelectors.backHomeButton); }
    get cancelButton(): Locator { return this.page.locator(CheckoutSelectors.cancelButton); }
    get errorMessage(): Locator { return this.page.locator(CheckoutSelectors.errorMessage); }
    get completeHeader(): Locator { return this.page.locator(CheckoutSelectors.completeHeader); }
    get errorIcons(): Locator { return this.page.locator(CheckoutSelectors.errorIcon); }
    get subtotal(): Locator { return this.page.locator(CheckoutSelectors.subtotal); }
    get tax(): Locator { return this.page.locator(CheckoutSelectors.tax); }
    get total(): Locator { return this.page.locator(CheckoutSelectors.total); }
    get paymentInformation(): Locator { return this.page.locator(CheckoutSelectors.paymentInformation).nth(0); }
    get shippingInformation(): Locator { return this.page.locator(CheckoutSelectors.shippingInformation).nth(1); }

    async fillInformation(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async clearInformation() {
        await this.firstNameInput.fill('');
        await this.lastNameInput.fill('');
        await this.postalCodeInput.fill('');
    }

    async clickContinue() {
        await this.continueButton.click();
    }

    async clickFinish() {
        await this.finishButton.click();
    }
    
    async clickBackHome() {
        await this.backHomeButton.click();
    }

    async clickCancel() {
        await this.cancelButton.click();
    }

    async verifyErrorMessage(message: string) {
        await expect(this.errorMessage).toContainText(message);
    }
    
    async verifyErrorIconsVisible(count: number = 3) {
        // Assert that the specified number of error icons (the red cross in the input field) are visible
        await expect(this.errorIcons).toHaveCount(count);
    }

    async verifyOrderCompleted() {
        await expect(this.completeHeader).toHaveText('Thank you for your order!');
    }

    async verifyOrderSummary(subtotal: string, tax: string, total: string) {
        await expect(this.subtotal).toHaveText(`Item total: ${subtotal}`);
        await expect(this.tax).toHaveText(`Tax: ${tax}`);
        await expect(this.total).toHaveText(`Total: ${total}`);
    }
}
