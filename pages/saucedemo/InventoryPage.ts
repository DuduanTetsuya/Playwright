import { Page, Locator, expect } from '@playwright/test';
import { InventorySelectors } from '../../selectors/saucedemo/inventory.selectors';

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

    get inventoryItems(): Locator {
        return this.page.locator(InventorySelectors.inventoryItem);
    }

    get itemPrices(): Locator {
        return this.page.locator(InventorySelectors.itemPrice);
    }

    get itemDescriptions(): Locator {
        return this.page.locator(InventorySelectors.itemDescription);
    }

    get menuButton(): Locator {
        return this.page.locator(InventorySelectors.menuButton);
    }

    get logoutLink(): Locator {
        return this.page.locator(InventorySelectors.logoutLink);
    }

    get resetAppStateLink(): Locator {
        return this.page.locator(InventorySelectors.resetAppStateLink);
    }

    addToCartButton(itemName: string): Locator {
        return this.page.locator(InventorySelectors.addToCartButton(itemName));
    }

    removeFromCartButton(itemName: string): Locator {
        return this.page.locator(InventorySelectors.removeFromCartButton(itemName));
    }

    productLink(itemId: string): Locator {
        const product = this.inventoryItems.filter({ has: this.addToCartButton(itemId) });
        return product.locator(InventorySelectors.productLink);
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

    async openMenu() {
        await this.menuButton.click();
    }

    async logout() {
        await this.openMenu();
        await this.logoutLink.click();
    }

    async resetAppState() {
        await this.openMenu();
        await this.resetAppStateLink.click();
    }

    async openProduct(itemId: string) {
        await this.productLink(itemId).click();
    }

    async getItemNames(): Promise<string[]> {
        return await this.itemNames.allInnerTexts();
    }

    async getProducts(): Promise<Array<{ id: string; name: string }>> {
        await expect(this.inventoryItems).not.toHaveCount(0);

        return this.inventoryItems.evaluateAll((items, itemNameSelector) => items.map(item => {
            const name = item.querySelector(itemNameSelector)?.textContent?.trim();
            const dataTest = item.querySelector('button[data-test^="add-to-cart-"]')?.getAttribute('data-test');
            const id = dataTest?.replace(/^add-to-cart-/, '');

            if (!name || !id || id === dataTest) {
                throw new Error('Unable to read product name or add-to-cart identifier from inventory item.');
            }

            return { id, name };
        }), InventorySelectors.itemName);
    }

    async getItemPrices(): Promise<number[]> {
        const priceTexts = await this.itemPrices.allInnerTexts();
        return priceTexts.map(price => parseFloat(price.replace('$', '')));
    }

    // Assertions
    async verifyInventoryPageLoaded() {
        await expect(this.title).toHaveText('Products');
    }

    async verifyProductCount(expectedCount: number) {
        await expect(this.inventoryItems).toHaveCount(expectedCount);
    }

    async verifyCartBadgeCount(expectedCount: string) {
        await expect(this.shoppingCartBadge).toHaveText(expectedCount);
    }
    
    async verifyCartBadgeHidden() {
        await expect(this.shoppingCartBadge).toBeHidden();
    }

    async verifyCartBadgeVisible() {
        await expect(this.shoppingCartBadge).toBeVisible();
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
