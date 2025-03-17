import { Page, expect } from '@playwright/test';
import locators from '../config/locators.json';

export class AdminPage{
    constructor(private page: Page){}
    //General
    privateadminSideMenu = locators.general.adminSideMenu;
    pageTitle = locators.general.pageTitle;
    inputBox = locators.general.inputBox;
    autoInputBox = locators.general.autoInputBox;
    autoDropDown = locators.general.autoDropDown;
    selectText = locators.general.selectText;
    dropdownOption = locators.general.dropdownOption;
    buttonAdd = locators.general.buttonAdd;
    buttonSave = locators.general.buttonSave;
    mainTitle = locators.general.mainTitle;
    buttonSearch = locators.general.buttonSearch;
    fieldErrorMessage = locators.general.fieldErrorMessage;
    quickPopup = locators.general.quickPopup;
    table = locators.general.table;
    deleteButton = locators.general.deleteButton;
    tableRow = locators.general.tableRow;
    buttonCancel = locators.general.buttonCancel;
    confirmDelete = locators.general.confirmDelete;
    popup = locators.general.popup;
    //User Management
    userManagement = locators.userManagement.menu;
    userManagement_Users = locators.userManagement.users;
    userManagement_Users_Title = locators.userManagement.usersTitle;
    //Job
    job = locators.job.menu;
    jobTitles = locators.job.jobTitles;

    async goToAdmin(){
        await this.page.locator(this.adminSideMenu).click();
    }

    async assertAdminPage(){
        await expect(this.page.locator(this.pageTitle)).toContainText('Admin');
    }

    //#region ========== User Management ==========
    async goToUserManagement_Users(){
        await this.page.locator(this.userManagement).click();
        await this.page.locator(this.userManagement_Users).click();
    }
    
    async assertUserManagement_Users(){
        await expect(this.page.locator(this.userManagement_Users_Title)).toHaveText('System Users');
    }
    
    async addNewUser(username: string, password: string, role: string, status: string){
        await this.page.locator(this.buttonAdd).click();
        //User Role
        await this.page.locator(this.selectText).first().click();
        await this.page.locator(this.dropdownOption, { hasText: role }).click();
        //Status
        await this.page.locator(this.selectText).nth(1).click();
        await this.page.locator(this.dropdownOption, { hasText: status }).click();
        //Username & Password
        await this.page.locator(this.inputBox).nth(1).fill(username);
        await this.page.locator(this.inputBox).nth(2).fill(password);
        await this.page.locator(this.inputBox).nth(3).fill(password);
        //Employee Name
        await this.page.locator(this.autoInputBox).click();
        await this.page.locator(this.autoInputBox).fill('J');
        await this.page.getByRole('option', { name: 'James Butler'}).click();
        //Ensure no error message in any field
        await expect(this.page.locator(this.fieldErrorMessage)).not.toBeVisible();
        //Save
        await this.page.locator(this.buttonSave).click();
        await this.page.locator(this.quickPopup).filter({ hasText: 'Successfully Saved' }).waitFor({ state: 'attached' });
        await this.page.locator(this.quickPopup).filter({ hasText: 'Successfully Saved' }).waitFor({ state: 'detached' });
    }

    async assertUserExist(username: string){
        await this.page.locator(this.inputBox).nth(1).fill(username);
        await this.page.locator(this.buttonSearch).click();
        await this.page.waitForSelector(this.table, { state: 'visible' });
        await expect(this.page.locator(this.table).filter({ hasText: username })).toBeVisible();
    }

    async deleteUser(username: string){
        await this.page.locator(this.tableRow).filter({ hasText: username }).locator(this.deleteButton).click();
        await this.page.locator(this.buttonCancel).click();
        await this.page.locator(this.tableRow).filter({ hasText: username }).locator(this.deleteButton).click();
        await this.page.locator(this.confirmDelete).click();
        await this.page.locator(this.quickPopup).filter({hasText: 'Successfully Deleted'}).waitFor({ state: 'attached' });
        await this.page.locator(this.quickPopup).filter({hasText: 'Successfully Deleted'}).waitFor({ state: 'detached' });
    }

    async assertUserNotExist(username: string){
        await this.page.locator(this.inputBox).nth(1).fill(username);
        await this.page.locator(this.buttonSearch).click();
        await this.page.locator(this.quickPopup).filter({hasText: 'No Record'}).waitFor({ state: 'attached' });
        await this.page.locator(this.quickPopup).filter({hasText: 'No Record'}).waitFor({ state: 'detached' });
    }

    //#endregion ========== User Management ==========
 
    //#region Job
    async goToJobs_JobTitles(){
        await this.page.locator(this.job).click();
        await this.page.locator(this.jobTitles).click();
    }

    async assertJob_JobTitles(){
        await expect(this.page.locator(this.mainTitle)).toHaveText('Job Titles');
    }
    //#endregion
}