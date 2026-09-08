export const PimSelectors = {
    addEmployeeTab: 'a:has-text("Add Employee")',
    employeeListTab: 'a:has-text("Employee List")',
    firstNameInput: 'input[name="firstName"]',
    lastNameInput: 'input[name="lastName"]',
    saveButton: 'button[type="submit"]',
    employeeNameSearchInput: 'label:has-text("Employee Name") >> xpath=../../..//input',
    searchButton: 'button[type="submit"]',
    searchResultsTable: '.oxd-table-body',
    successToast: '.oxd-toast--success',
    deleteButton: '.oxd-table-cell-actions button i.bi-trash',
    confirmDeleteButton: 'button:has-text("Yes, Delete")'
};

