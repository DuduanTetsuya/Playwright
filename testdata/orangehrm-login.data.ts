export const orangeHrmLoginFailureCases = [
    {
        name: 'User should not able to login with invalid credentials',
        username: 'InvalidUser',
        password: 'InvalidPass',
        expectedError: 'Invalid credentials',
    },
] as const;
