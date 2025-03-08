import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("SauceDemo Login", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("Valid credential should Success", async ({ page }) => {
    await loginPage.login("standard_user", "secret_sauce");
    //Assert
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

  test("Invalid credential should Error", async ({ page }) => { 
    await loginPage.login("standard_user", "wrong_password");
    const errorMessage = await loginPage.getErrorMessage();
    //Assert
    expect(errorMessage).toContain("Username and password do not match");
  });
});
