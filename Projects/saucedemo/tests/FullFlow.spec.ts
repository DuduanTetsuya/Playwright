import { ProductPage } from "../pages/ProductPage";
import { LoginPage } from "../pages/LoginPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { test, expect } from "@playwright/test";
import locators from "../pages/locators.json";

test("SauceDemo Full Test", async ({ page }) => {
    const numItems = Math.floor(Math.random() * 4) + 2;
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    await test.step("Login to SauceDemo", async () => {
        await loginPage.goto();
        await loginPage.login("standard_user", "secret_sauce");
        //Assert
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });
    
    await test.step("Sort price 'Low to High'", async () => {
        await productPage.sortProduct("lohi");
        const sorted = await productPage.validateSortedProducts("lohi");
        //Assert
        expect(sorted).toBe(true);
    });

    await test.step("Sort price 'High to Low'", async () => {
        await productPage.sortProduct("hilo");
        const sorted = await productPage.validateSortedProducts("hilo");
        //Assert
        expect(sorted).toBe(true);
    });
    
    await test.step("Sort name 'AZ'", async () => {
        await productPage.sortProduct("az");
        const sorted = await productPage.validateSortedProducts("az");
        //Assert
        expect(sorted).toBe(true);
    });
    
    await test.step("Sort name 'ZA'", async () => {
        await productPage.sortProduct("za");
        const sorted = await productPage.validateSortedProducts("za");
        //Assert
        expect(sorted).toBe(true);
    });
    
    await test.step("Select random items", async () => {
        await productPage.selectRandomItem(numItems);
        //Assert
        await expect(page.locator(".shopping_cart_badge")).toHaveText(numItems.toString());
    });
    
    await page.pause();

    // await test.step("Manage cart - delete 1 item", async () => {
    //     await productPage.goToCart();
    //     //Assert
    //     await expect(page.locator(locators.cartPage.cartTitle)).toHaveText("Your Cart");

    //     await page.locator(locators.inventoryPage.removeFromCartButton).first().click();
    //     //Assert
    //     await expect(page.locator(".shopping_cart_badge")).toHaveText((numItems - 1).toString());
    // });

    // await test.step("Go to checkout", async () => {
    //     await cartPage.goToCheckout();
    //     //Assert
    //     await expect(page.locator(locators.checkoutPage.checkoutTitle)).toHaveText('Checkout: Your Information');
    // });

    // await test.step("Fill form and continue", async () => {
    //     await checkoutPage.fillFormAndContinue('Duanestra', 'Febri', '55581');
    //     //Assert
    //     await expect(page.locator(locators.checkoutOverviewPage.overviewTitle)).toHaveText('Checkout: Overview');
    // });

    // await test.step("Finish checkout", async () => {
    //     await checkoutPage.overviewFinish();
    //     //Assert
    //     await expect(page.locator(locators.checkoutCompletePage.successMessage)).toHaveText('Thank you for your order!');
    //     await expect(page.locator(locators.checkoutCompletePage.backHomeButton)).toBeVisible();
    // });

    // await page.pause();
});