import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Saucedemo Tests with POM', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.goto();
    });

    test('should login successfully with valid credentials', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPageLoaded();
    });

    test('should show error message for locked out user', async () => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        await loginPage.verifyErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    });

    test('should add item to cart', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPageLoaded();
        
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.verifyCartBadgeCount('1');
    });

    test('should remove item from cart', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPageLoaded();
        
        // Add item first
        await inventoryPage.addItemToCart('sauce-labs-bike-light');
        await inventoryPage.verifyCartBadgeCount('1');

        // Remove item
        await inventoryPage.removeItemFromCart('sauce-labs-bike-light');
        await inventoryPage.verifyCartBadgeHidden();
    });

    test('should be able to sort items by price (low to high)', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPageLoaded();
        
        await inventoryPage.sortItems('lohi');
        await inventoryPage.verifyItemsSortedByPrice(true);
    });

    test('should be able to sort items by price (high to low)', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPageLoaded();
        
        await inventoryPage.sortItems('hilo');
        await inventoryPage.verifyItemsSortedByPrice(false);
    });

    test('should be able to sort items by name (A to Z)', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPageLoaded();
        
        await inventoryPage.sortItems('az');
        await inventoryPage.verifyItemsSortedByName(true);
    });

    test('should be able to sort items by name (Z to A)', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPageLoaded();
        
        await inventoryPage.sortItems('za');
        await inventoryPage.verifyItemsSortedByName(false);
    });
});
