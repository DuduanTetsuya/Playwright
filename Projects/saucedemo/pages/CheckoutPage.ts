import { Page, expect } from "@playwright/test";
import locators from './locators.json';

export class CheckoutPage{
    constructor(private page: Page){}
    firstNameField = locators.checkoutPage.firstNameField;
    lastNameField = locators.checkoutPage.lastNameField;
    postalCodeField = locators.checkoutPage.postalCodeField;
    continueButton = locators.checkoutPage.continueButton;
    finishButton = locators.checkoutOverviewPage.finishButton;

    async fillFormAndContinue(firstName: string, lastName: string, postalCode: string){
        await this.page.locator(this.firstNameField).fill(firstName);
        await this.page.locator(this.lastNameField).fill(lastName);
        await this.page.locator(this.postalCodeField).fill(postalCode);
        await this.page.locator(this.continueButton).click();
    }

    async overviewFinish(){
        await this.page.locator(this.finishButton).click();
    }
}