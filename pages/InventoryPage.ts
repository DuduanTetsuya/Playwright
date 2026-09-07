import { Page, Locator, expect } from '@playwright/test';
import { InventorySelectors } from '../selectors/inventory.selectors';

export class InventoryPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Getters
    get title(): Locator {
        return this.page.locator(InventorySelectors.title);
    }

    get shoppingCartBadge(): Locator {
        return this.page.locator(InventorySelectors.shoppingCartBadge);
    }
    
    get shoppingCartLink(): Locator {
        return this.page.locator(InventorySelectors.shoppingCartLink);
    }

    get sortDropdown(): Locator {
        return this.page.locator(InventorySelectors.sortDropdown);
    }

    get itemNames(): Locator {
        return this.page.locator(InventorySelectors.itemName);
    }

    get itemPrices(): Locator {
        return this.page.locator(InventorySelectors.itemPrice);
    }

    addToCartButton(itemName: string): Locator {
        return this.page.locator(InventorySelectors.addToCartButton(itemName));
    }

    removeFromCartButton(itemName: string): Locator {
        return this.page.locator(InventorySelectors.removeFromCartButton(itemName));
    }

    // Actions
    async clickShoppingCart() {
        await this.shoppingCartLink.click();
    }

    async addItemToCart(itemName: string) {
        await this.addToCartButton(itemName).click();
    }

    async removeItemFromCart(itemName: string) {
        await this.removeFromCartButton(itemName).click();
    }

    async sortItems(optionValue: string) {
        await this.sortDropdown.selectOption(optionValue);
    }

    async getItemNames(): Promise<string[]> {
        return await this.itemNames.allInnerTexts();
    }

    async getItemPrices(): Promise<number[]> {
        const priceTexts = await this.itemPrices.allInnerTexts();
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    // Assertions
    async verifyInventoryPageLoaded() {
        await expect(this.title).toHaveText('Products');
    }

    async verifyCartBadgeCount(expectedCount: string) {
        await expect(this.shoppingCartBadge).toHaveText(expectedCount);
    }
    
    async verifyCartBadgeHidden() {
        await expect(this.shoppingCartBadge).toBeHidden();
    }

    async verifyItemsSortedByName(ascending: boolean = true) {
        const names = await this.getItemNames();
        const sortedNames = [...names].sort();
        if (!ascending) {
            sortedNames.reverse();
        }
        expect(names).toEqual(sortedNames);
    }

    async verifyItemsSortedByPrice(ascending: boolean = true) {
        const prices = await this.getItemPrices();
        const sortedPrices = [...prices].sort((a, b) => a - b);
        if (!ascending) {
            sortedPrices.reverse();
        }
        expect(prices).toEqual(sortedPrices);
    }
}
