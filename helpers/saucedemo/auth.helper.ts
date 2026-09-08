import { Page } from '@playwright/test';
import { LoginPage } from '../../pages/saucedemo/LoginPage';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage';

export async function loginAsStandardUser(page: Page) {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.verifyInventoryPageLoaded();
}
