export const sauceDemoInvalidCredentials = {
    username: 'invalid_user',
    password: 'wrong_password',
    expectedError: 'Epic sadface: Username and password do not match any user in this service',
} as const;

export const sauceDemoLoginFailureCases = [
    {
        name: 'User should not able to login with locked out user',
        username: 'locked_out_user',
        password: 'secret_sauce',
        expectedError: 'Epic sadface: Sorry, this user has been locked out.',
    },
    {
        name: 'User should not able to login with invalid credentials',
        ...sauceDemoInvalidCredentials,
    },
    {
        name: 'User should not able to login with empty username',
        username: '',
        password: 'secret_sauce',
        expectedError: 'Epic sadface: Username is required',
    },
] as const;
