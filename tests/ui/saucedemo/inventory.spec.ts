import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../../pages/saucedemo/InventoryPage';
import { CartPage } from '../../../pages/saucedemo/CartPage';
import { LoginPage } from '../../../pages/saucedemo/LoginPage';
import { ProductDetailsPage } from '../../../pages/saucedemo/ProductDetailsPage';
import { loginAsStandardUser } from '../../../helpers/saucedemo/auth.helper';

test.describe('Inventory Tests', () => {
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let loginPage: LoginPage;
    let productDetailsPage: ProductDetailsPage;

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        loginPage = new LoginPage(page);
        productDetailsPage = new ProductDetailsPage(page);
        await loginAsStandardUser(page);
    });

    test('Inventory displays all six products with a name and price', async () => {
        await inventoryPage.verifyProductCount(6);
        await expect(inventoryPage.itemNames).toHaveCount(6);
        await expect(inventoryPage.itemPrices).toHaveCount(6);
        await expect(inventoryPage.itemDescriptions).toHaveCount(6);
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

    test('Removing one product keeps the other cart products selected', async () => {
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.addItemToCart('sauce-labs-bike-light');
        await inventoryPage.removeItemFromCart('sauce-labs-backpack');

        await inventoryPage.verifyCartBadgeCount('1');
        await inventoryPage.clickShoppingCart();
        await cartPage.verifyItemsInCart(['Sauce Labs Bike Light']);
    });

    test('User can reset cart state from the menu', async () => {
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.resetAppState();
        await inventoryPage.verifyCartBadgeHidden();
    });

    test('User can open a product and return to inventory', async () => {
        await inventoryPage.openProduct('sauce-labs-backpack');
        await productDetailsPage.verifyProductDetails(
            'Sauce Labs Backpack',
            'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
            '$29.99'
        );

        await productDetailsPage.goBackToProducts();
        await inventoryPage.verifyInventoryPageLoaded();
    });

    test('User can log out from the inventory menu', async () => {
        await inventoryPage.logout();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.usernameInput).toBeVisible();
    });

    for (const selection of [
        { label: 'odd', parity: 0 },
        { label: 'even', parity: 1 },
    ]) {
        test(`User can add products at ${selection.label} positions to cart`, async () => {
            const products = await inventoryPage.getProducts();
            const selectedProducts = products.filter((_, index) => index % 2 === selection.parity);
            const expectedCount = Math.floor((products.length + 1 - selection.parity) / 2);

            for (const product of selectedProducts) {
                await inventoryPage.addItemToCart(product.id);
            }

            expect(selectedProducts).toHaveLength(expectedCount);
            await inventoryPage.verifyCartBadgeCount(String(selectedProducts.length));
            await inventoryPage.clickShoppingCart();
            await cartPage.verifyItemsInCart(selectedProducts.map(product => product.name));
        });
    }

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
