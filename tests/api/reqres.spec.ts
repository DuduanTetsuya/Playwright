import { test, expect } from '@playwright/test';

test.describe('API Testing Reqres.in', () => {
    const baseURL = 'https://reqres.in/api';

    test('GET - Get list of users', async ({ request }) => {
        const response = await request.get(`${baseURL}/users?page=2`);
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody.page).toBe(2);
        expect(responseBody.data.length).toBeGreaterThan(0);
    });

    test('GET - Get single user', async ({ request }) => {
        const response = await request.get(`${baseURL}/users/2`);
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody.data.id).toBe(2);
        expect(responseBody.data.first_name).toBe('Janet');
    });

    test('POST - Create new user', async ({ request }) => {
        const payload = {
            name: 'Morpheus',
            job: 'Leader'
        };

        const response = await request.post(`${baseURL}/users`, {
            data: payload
        });
        
        expect(response.status()).toBe(201); // 201 Created
        
        const responseBody = await response.json();
        expect(responseBody.name).toBe(payload.name);
        expect(responseBody.job).toBe(payload.job);
        expect(responseBody).toHaveProperty('id');
        expect(responseBody).toHaveProperty('createdAt');
    });

    test('PUT - Update user data', async ({ request }) => {
        const payload = {
            name: 'Morpheus',
            job: 'Zion Resident'
        };

        const response = await request.put(`${baseURL}/users/2`, {
            data: payload
        });
        
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody.job).toBe(payload.job);
        expect(responseBody).toHaveProperty('updatedAt');
    });

    test('DELETE - Delete user', async ({ request }) => {
        const response = await request.delete(`${baseURL}/users/2`);
        // Reqres delete api returns 204 No Content
        expect(response.status()).toBe(204);
    });
});

