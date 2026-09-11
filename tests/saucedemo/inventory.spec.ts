import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';
import { loginAsStandardUser } from '../../helpers/saucedemo/auth.helper';

test.describe('Inventory Tests', () => {
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page);
        await loginAsStandardUser(page);
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

