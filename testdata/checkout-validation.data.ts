export const checkoutValidationCases = [
    {
        name: 'a first name',
        firstName: '',
        lastName: '',
        postalCode: '',
        expectedError: 'Error: First Name is required',
        expectedErrorIcons: 3,
    },
    {
        name: 'a last name after first name is provided',
        firstName: 'John',
        lastName: '',
        postalCode: '',
        expectedError: 'Error: Last Name is required',
        expectedErrorIcons: undefined,
    },
    {
        name: 'a postal code after names are provided',
        firstName: 'John',
        lastName: 'Doe',
        postalCode: '',
        expectedError: 'Error: Postal Code is required',
        expectedErrorIcons: 3,
    },
] as const;
