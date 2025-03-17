import { Page, expect } from '@playwright/test';
import locators from '../config/locators.json';

export class LoginPage{
    constructor( private page: Page ){}

    usernameField = locators.loginPage.usernameField
    passwordField = locators.loginPage.passwordField
    loginButton = locators.loginPage.loginButton
    errorMessage = locators.loginPage.errorMessage
    pageTitle = locators.general.pageTitle;

    async visit(){
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    }

    async assertVisit(){
        await expect(this.page).toHaveURL(/.*login/);
    }

    async login(username: string, password: string){
        await this.page.locator(this.usernameField).fill(username);
        await this.page.locator(this.passwordField).fill(password);
        await this.page.locator(this.loginButton).click();
    }

    async assertLoginSuccess(){
        await expect(this.page.locator(this.pageTitle)).toHaveText('Dashboard');
    }

    async assertLoginFailed(){
        await expect(this.page.locator(this.errorMessage)).toContainText('Invalid credentials');
    }
}