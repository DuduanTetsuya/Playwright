import { Page, expect } from '@playwright/test'
import locators from './locators.json'

export class CartPage{
    constructor(private page: Page){}
    checkoutButton = locators.cartPage.checkoutButton;

    async removeItem(){
        const removeButton = this.page.locator('[data-test^="remove"]');
    
        // Cek apakah ada tombol "Remove"
        if (await removeButton.count() > 0) {
            await removeButton.first().click();
        } else {
            throw new Error("❌ No item left");
        }
    }

    async goToCheckout(){
        await this.page.locator(this.checkoutButton).click();
    }
}