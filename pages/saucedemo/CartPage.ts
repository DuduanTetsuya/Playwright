import { Page, Locator } from '@playwright/test';
import { CartSelectors } from '../../selectors/saucedemo/cart.selectors';

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get checkoutButton(): Locator {
        return this.page.locator(CartSelectors.checkoutButton);
    }

    async clickCheckout() {
        await this.checkoutButton.click();
    }
}

