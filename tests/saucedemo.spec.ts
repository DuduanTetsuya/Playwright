import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Saucedemo Tests with POM', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
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

    test('should complete checkout flow with validation on empty fields', async () => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.verifyInventoryPageLoaded();

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
        // Now only Last name and zip should have error icons, but SauceDemo keeps the icon for first name too until valid submission or it might be 3 icons. Actually, Sauce demo puts error icon on all fields if ANY error exists. So let's skip the exact icon count here, or just verify error message.

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
