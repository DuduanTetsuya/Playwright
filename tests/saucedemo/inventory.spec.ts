import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';

test.describe('Inventory Tests', () => {
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await loginPage.goto();
    });

    test('User can add item to cart', async () => {
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.verifyCartBadgeCount('1');
    });

    test('User can remove item from cart', async () => {
        // Add item first
        await inventoryPage.addItemToCart('sauce-labs-bike-light');
        await inventoryPage.verifyCartBadgeCount('1');

        // Remove item
        await inventoryPage.removeItemFromCart('sauce-labs-bike-light');
        await inventoryPage.verifyCartBadgeHidden();
    });

    test('User can sort items by price (low to high)', async () => {
        await inventoryPage.sortItems('lohi');
        await inventoryPage.verifyItemsSortedByPrice(true);
    });

    test('User can sort items by price (high to low)', async () => {
        await inventoryPage.sortItems('hilo');
        await inventoryPage.verifyItemsSortedByPrice(false);
    });

    test('User can sort items by name (A to Z)', async () => {
        await inventoryPage.sortItems('az');
        await inventoryPage.verifyItemsSortedByName(true);
    });

    test('User can sort items by name (Z to A)', async () => {
        await inventoryPage.sortItems('za');
        await inventoryPage.verifyItemsSortedByName(false);
    });
});

