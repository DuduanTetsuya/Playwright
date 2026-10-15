import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get name(): Locator {
        return this.page.locator('.inventory_details_name');
    }

    get description(): Locator {
        return this.page.locator('.inventory_details_desc');
    }

    get price(): Locator {
        return this.page.locator('.inventory_details_price');
    }

    get backButton(): Locator {
        return this.page.locator('[data-test="back-to-products"]');
    }

    async goBackToProducts() {
        await this.backButton.click();
    }

    async verifyProductDetails(name: string, description: string, price: string) {
        await expect(this.name).toHaveText(name);
        await expect(this.description).toHaveText(description);
        await expect(this.price).toHaveText(price);
    }
}
