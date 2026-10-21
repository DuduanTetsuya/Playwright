import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../../pages/saucedemo/InventoryPage';
import { CartPage } from '../../../pages/saucedemo/CartPage';
import { CheckoutPage } from '../../../pages/saucedemo/CheckoutPage';
import { loginAsStandardUser } from '../../../helpers/saucedemo/auth.helper';
import { checkoutValidationCases } from '../../../testdata/checkout-validation.data';

test.describe('Checkout Tests', () => {
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await loginAsStandardUser(page);
        await goToCheckoutInformation();
    });

    async function goToCheckoutInformation() {
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.clickShoppingCart();
        await cartPage.clickCheckout();
    }

    for (const validationCase of checkoutValidationCases) {
        test(`Checkout requires ${validationCase.name}`, async () => {
            await checkoutPage.fillInformation(
                validationCase.firstName,
                validationCase.lastName,
                validationCase.postalCode
            );
            await checkoutPage.clickContinue();
            await checkoutPage.verifyErrorMessage(validationCase.expectedError);

            if (validationCase.expectedErrorIcons) {
                await checkoutPage.verifyErrorIconsVisible(validationCase.expectedErrorIcons);
            }
        });
    }

    test('User can cancel checkout information and return to the cart', async () => {
        await checkoutPage.clickCancel();
        await cartPage.verifyCartLoaded();
        await cartPage.verifyItemsInCart(['Sauce Labs Backpack']);
    });

    test('User can review order totals before completing checkout', async () => {
        await checkoutPage.fillInformation('John', 'Doe', '12345');
        await checkoutPage.clickContinue();
        await checkoutPage.verifyOrderSummary('$29.99', '$2.40', '$32.39');
        await expect(checkoutPage.paymentInformation).toHaveText('SauceCard #31337');
        await expect(checkoutPage.shippingInformation).toHaveText('Free Pony Express Delivery!');
    });

    test('User can cancel checkout overview and return to inventory', async () => {
        await checkoutPage.fillInformation('John', 'Doe', '12345');
        await checkoutPage.clickContinue();
        await checkoutPage.clickCancel();

        await inventoryPage.verifyInventoryPageLoaded();
        await inventoryPage.verifyCartBadgeCount('1');
    });

    test('User can complete checkout and return to inventory with an empty cart', async () => {
        await checkoutPage.fillInformation('John', 'Doe', '12345');
        await checkoutPage.clickContinue();
        await checkoutPage.clickFinish();
        await checkoutPage.verifyOrderCompleted();
        await checkoutPage.clickBackHome();
        await inventoryPage.verifyInventoryPageLoaded();
        await inventoryPage.verifyCartBadgeHidden();
    });
});
