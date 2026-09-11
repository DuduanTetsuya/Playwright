import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage as SauceDemoLoginPage } from './pages/saucedemo/LoginPage';
import { OrangeHRMLoginPage } from './pages/orangehrm/LoginPage';
import { InventoryPage } from './pages/saucedemo/InventoryPage';

async function globalSetup(_config: FullConfig) {
    const authDirectory = path.resolve(__dirname, 'playwright/.auth');
    fs.mkdirSync(authDirectory, { recursive: true });

    const requestedArguments = process.argv.slice(2).join(' ').toLowerCase();
    const requestsSauceDemo = requestedArguments.includes('saucedemo');
    const requestsOrangeHrm = requestedArguments.includes('orangehrm');
    const setupSauceDemo = !requestsOrangeHrm || requestsSauceDemo;
    const setupOrangeHrm = !requestsSauceDemo || requestsOrangeHrm;

    const browser = await chromium.launch();

    if (setupSauceDemo) {
        const sauceDemoContext = await browser.newContext();
        const sauceDemoPage = await sauceDemoContext.newPage();
        sauceDemoPage.setDefaultNavigationTimeout(60000);
        const sauceDemoLoginPage = new SauceDemoLoginPage(sauceDemoPage);
        const sauceDemoInventoryPage = new InventoryPage(sauceDemoPage);
        await sauceDemoLoginPage.goto();
        await sauceDemoLoginPage.login(process.env.SAUCEDEMO_USERNAME!, process.env.SAUCEDEMO_PASSWORD!);
        await sauceDemoInventoryPage.verifyInventoryPageLoaded();
        await sauceDemoContext.storageState({ path: path.join(authDirectory, 'saucedemo.json') });
        await sauceDemoContext.close();
    }

    if (setupOrangeHrm) {
        const orangeHrmContext = await browser.newContext();
        const orangeHrmPage = await orangeHrmContext.newPage();
        orangeHrmPage.setDefaultNavigationTimeout(60000);
        const orangeHrmLoginPage = new OrangeHRMLoginPage(orangeHrmPage);
        await orangeHrmLoginPage.goto();
        await orangeHrmLoginPage.login(process.env.ORANGEHRM_USERNAME!, process.env.ORANGEHRM_PASSWORD!);
        await orangeHrmLoginPage.verifyDashboardLoaded();
        await orangeHrmContext.storageState({ path: path.join(authDirectory, 'orangehrm.json') });
        await orangeHrmContext.close();
    }

    await browser.close();
}

export default globalSetup;