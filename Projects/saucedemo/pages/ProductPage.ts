import { Page } from "@playwright/test";
import locators from './locators.json';

export class ProductPage {
    constructor(private page: Page) {}

    addButton = locators.inventoryPage.addToCartButton;
    cartButton = locators.inventoryPage.shoppingCartIcon;
    sortDropDown = locators.inventoryPage.sortDropdown;
    inventoryItemNames = locators.inventoryPage.inventoryItemNames;
    inventoryItemPrices = locators.inventoryPage.inventoryItemPrices;

    async selectRandomItem(numItems: number) {
        const addToCartButtons = await this.page.locator(this.addButton).all();
        const selectedButtons = addToCartButtons.sort(() => 0.5 - Math.random()).slice(0, numItems);
    
        for (const button of selectedButtons) {
            await button.click();
        }
    }    

    async goToCart(){
        await this.page.locator(this.cartButton).click();
    }

    async sortProduct(option: 'az' | 'za' | 'lohi' | 'hilo'){
        await this.page.locator(this.sortDropDown).selectOption(option);
    }

    async validateSortedProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
        const productNames = await this.page.locator(this.inventoryItemNames).allInnerTexts();
        const productPrices = await this.page.locator(this.inventoryItemPrices).allInnerTexts();
        
        if (option === 'az') {
            return productNames.slice().sort().join() === productNames.join();
        } 
        if (option === 'za') {
            return productNames.slice().sort().reverse().join() === productNames.join();
        } 
        if (option === 'lohi') {
            const prices = productPrices.map(price => parseFloat(price.replace('$', '')));
            return prices.slice().sort((a, b) => a - b).join() === prices.join();
        } 
        if (option === 'hilo') {
            const prices = productPrices.map(price => parseFloat(price.replace('$', '')));
            return prices.slice().sort((a, b) => b - a).join() === prices.join();
        }
        
        return false;
    }    
}
