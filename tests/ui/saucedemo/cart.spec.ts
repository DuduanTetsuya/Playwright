import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../../pages/saucedemo/InventoryPage';
import { CartPage } from '../../../pages/saucedemo/CartPage';
import { CheckoutPage } from '../../../pages/saucedemo/CheckoutPage';
import { loginAsStandardUser } from '../../../helpers/saucedemo/auth.helper';

test.describe('Cart Tests', () => {
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await loginAsStandardUser(page);
    });

    test('User can view an empty cart', async () => {
        await inventoryPage.clickShoppingCart();

        await cartPage.verifyCartLoaded();
        await cartPage.verifyCartIsEmpty();
        await expect(cartPage.checkoutButton).toBeVisible();
    });

    test('User can remove a product from the cart', async () => {
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.clickShoppingCart();
        await cartPage.removeItem('sauce-labs-backpack');

        await cartPage.verifyCartIsEmpty();
        await inventoryPage.verifyCartBadgeHidden();
    });

    test('User can continue shopping from the cart', async () => {
        await inventoryPage.clickShoppingCart();
        await cartPage.clickContinueShopping();

        await inventoryPage.verifyInventoryPageLoaded();
    });

    test('User can proceed from the cart to checkout information', async () => {
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.clickShoppingCart();
        await cartPage.clickCheckout();

        await expect(checkoutPage.firstNameInput).toBeVisible();
        await expect(checkoutPage.lastNameInput).toBeVisible();
        await expect(checkoutPage.postalCodeInput).toBeVisible();
    });
});
