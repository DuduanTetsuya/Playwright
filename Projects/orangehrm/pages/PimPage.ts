import {Page, expect} from '@playwright/test'
import locators from '../config/locators.json';

export class PimPage{
    constructor(private page:Page){}
    //General
    adminSideMenu = locators.general.adminSideMenu;
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

    async goToPim(){
        await this.page.getByRole('link', { name: 'PIM' }).click();
    }

    async assertPimPage(){
        await expect(this.page.locator('h6')).toMatchAriaSnapshot(`- heading "PIM" [level=6]`);
    }
}