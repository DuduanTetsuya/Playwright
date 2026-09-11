import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';
import { CartPage } from '../../pages/saucedemo/CartPage';
import { CheckoutPage } from '../../pages/saucedemo/CheckoutPage';

test.describe('Checkout Tests', () => {
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await loginPage.goto();
    });

    test('User can complete checkout flow with validation on empty fields', async () => {
        // 1. Add item and go to cart
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.clickShoppingCart();

        // 2. Click checkout
        await cartPage.clickCheckout();

        // 3. Leave all fields empty, click continue, assert 3 error icons and error message
        await checkoutPage.clearInformation();
        await checkoutPage.clickContinue();
        await checkoutPage.verifyErrorMessage('Error: First Name is required');
        await checkoutPage.verifyErrorIconsVisible(3);

        // 4. Fill First Name, leave Last Name & Zip empty, assert Last Name error
        await checkoutPage.fillInformation('John', '', '');
        await checkoutPage.clickContinue();
        await checkoutPage.verifyErrorMessage('Error: Last Name is required');

        // 5. Fill First Name and Last Name, leave Zip empty, assert Postal Code error
        await checkoutPage.clearInformation();
        await checkoutPage.fillInformation('John', 'Doe', '');
        await checkoutPage.clickContinue();
        await checkoutPage.verifyErrorMessage('Error: Postal Code is required');

        // 6. Fill all fields correctly and continue
        await checkoutPage.clearInformation();
        await checkoutPage.fillInformation('John', 'Doe', '12345');
        await checkoutPage.clickContinue();

        // 7. Finish order
        await checkoutPage.clickFinish();
        await checkoutPage.verifyOrderCompleted();

        // 8. Click Back Home and assert back on inventory page
        await checkoutPage.clickBackHome();
        await inventoryPage.verifyInventoryPageLoaded();
    });
});

