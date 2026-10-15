import { Page, Locator, expect } from '@playwright/test';
import { CartSelectors } from '../../selectors/saucedemo/cart.selectors';

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get checkoutButton(): Locator {
        return this.page.locator(CartSelectors.checkoutButton);
    }

    get itemNames(): Locator {
        return this.page.locator(CartSelectors.itemName);
    }

    get cartItems(): Locator {
        return this.page.locator(CartSelectors.cartItems);
    }

    get itemPrices(): Locator {
        return this.page.locator(CartSelectors.itemPrice);
    }

    get cartTitle(): Locator {
        return this.page.locator(CartSelectors.cartTitle);
    }

    get continueShoppingButton(): Locator {
        return this.page.locator(CartSelectors.continueShoppingButton);
    }

    removeButton(itemId: string): Locator {
        return this.page.locator(CartSelectors.removeButton(itemId));
    }

    async clickCheckout() {
        await this.checkoutButton.click();
    }

    async clickContinueShopping() {
        await this.continueShoppingButton.click();
    }

    async removeItem(itemId: string) {
        await this.removeButton(itemId).click();
    }

    async getItemPrices(): Promise<number[]> {
        const priceTexts = await this.itemPrices.allInnerTexts();
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    async verifyItemsInCart(expectedNames: string[]) {
        await expect(this.itemNames).toHaveText(expectedNames);
    }

    async verifyCartIsEmpty() {
        await expect(this.cartItems).toHaveCount(0);
    }

    async verifyCartLoaded() {
        await expect(this.cartTitle).toHaveText('Your Cart');
    }
}
