
import { test, chromium } from '@playwright/test';

test('Login test demo', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://ecommerce-playground.Lambdatest.io/");
    await page.hover("//a[@data-toggle='dropdown']//span[contains(.,'My account')]");
    await page.click("'Login'");

    await page.fill("input[name='email']", "koushik350@gmail.com")
    await page.fill("input[name='password']", "Pass123$")
    await page.click("inpit[value='Login']")

    const newContext = await browser.newContext()
    const newPage = await newContext.newPage()
    await newPage.goto("https://ecommerce-playground.Lambdatest.io/");
    await newPage.waitForTimeout(5000);
})