import { test, expect } from '@playwright/test';

test.describe('Reqres API network interception', () => {
    const endpoint = 'https://reqres.in/api/users/2';

    test('Intercept a browser API request and return a mocked user response', async ({ page }) => {
        let interceptedMethod = '';
        let interceptedUrl = '';

        await page.route(endpoint, async route => {
            interceptedMethod = route.request().method();
            interceptedUrl = route.request().url();

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                headers: {
                    'access-control-allow-origin': '*'
                },
                body: JSON.stringify({
                    data: {
                        id: 2,
                        email: 'mocked.user@example.com',
                        first_name: 'Mocked',
                        last_name: 'User'
                    }
                })
            });
        });

        await page.goto('about:blank');
        const result = await page.evaluate(async apiUrl => {
            const response = await fetch(apiUrl);
            return {
                status: response.status,
                body: await response.json()
            };
        }, endpoint);

        expect(interceptedMethod).toBe('GET');
        expect(interceptedUrl).toBe(endpoint);
        expect(result.status).toBe(200);
        expect(result.body.data).toEqual({
            id: 2,
            email: 'mocked.user@example.com',
            first_name: 'Mocked',
            last_name: 'User'
        });
    });
});
