import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';

test.describe('SauceDemo Products', () => {
    const numItems = Math.floor(Math.random() * 5) + 2;
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login("standard_user", "secret_sauce");
        //Assert
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
    });

    test('Select random item', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.selectRandomItem(numItems);
        // Assert
        await expect(page.locator('.shopping_cart_badge')).toHaveText(numItems.toString());
    });
});
