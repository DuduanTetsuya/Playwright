import { Page, Locator } from '@playwright/test';
import { SideMenuSelectors } from '../../selectors/orangehrm/sidemenu.selectors';

export class SideMenuPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getMenuItem(menuName: string): Locator {
        return this.page.locator(SideMenuSelectors.menuItem(menuName));
    }

    async clickMenuItem(menuName: string) {
        await this.getMenuItem(menuName).click();
    }
}

