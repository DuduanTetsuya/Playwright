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

    test('GET - Get first page with pagination metadata and unique users', async ({ request }) => {
        const response = await request.get(`${baseURL}/users?page=1`);
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');

        const responseBody = await response.json();
        expect(responseBody.page).toBe(1);
        expect(responseBody.per_page).toBe(6);
        expect(responseBody.total).toBeGreaterThanOrEqual(responseBody.data.length);
        expect(responseBody.total_pages).toBe(2);
        expect(responseBody.data).toHaveLength(6);
        expect(new Set(responseBody.data.map((user: { id: number }) => user.id)).size).toBe(6);
        expect(responseBody.data[0]).toMatchObject({
            id: 1,
            email: 'george.bluth@reqres.in',
            first_name: 'George',
            last_name: 'Bluth'
        });
    });

    test('GET - Return not found for a user that does not exist', async ({ request }) => {
        const response = await request.get(`${baseURL}/users/23`);

        expect(response.status()).toBe(404);
        expect(await response.json()).toEqual({});
    });

    test('GET - Get a paginated list of colors', async ({ request }) => {
        const response = await request.get(`${baseURL}/unknown?page=2`);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.page).toBe(2);
        expect(responseBody.data).toHaveLength(6);
        expect(responseBody.data[0]).toMatchObject({
            id: 7,
            name: 'sand dollar',
            year: 2006,
            color: '#DECDBE'
        });
    });

    test('GET - Get a single color resource', async ({ request }) => {
        const response = await request.get(`${baseURL}/unknown/2`);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.data).toEqual({
            id: 2,
            name: 'fuchsia rose',
            year: 2001,
            color: '#C74375',
            pantone_value: '17-2031'
        });
    });

    test('GET - Return not found for an unknown resource', async ({ request }) => {
        const response = await request.get(`${baseURL}/unknown/23`);

        expect(response.status()).toBe(404);
        expect(await response.json()).toEqual({});
    });

    test('POST - Login successfully with valid credentials', async ({ request }) => {
        const response = await request.post(`${baseURL}/login`, {
            data: {
                email: 'eve.holt@reqres.in',
                password: 'pistol'
            }
        });
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody.token).toBeTruthy();
    });

    test('POST - Reject login when password is missing', async ({ request }) => {
        const response = await request.post(`${baseURL}/login`, {
            data: { email: 'peter@klaven' }
        });

        expect(response.status()).toBe(400);
    });

    test('POST - Reject registration when password is missing', async ({ request }) => {
        const response = await request.post(`${baseURL}/register`, {
            data: { email: 'sydney@fife' }
        });

        expect(response.status()).toBe(400);
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

    test('PATCH - Update only the provided user field', async ({ request }) => {
        const payload = { job: 'Architect' };
        const response = await request.patch(`${baseURL}/users/2`, {
            data: payload
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.job).toBe(payload.job);
        expect(responseBody).toHaveProperty('updatedAt');
        expect(responseBody).not.toHaveProperty('name');
    });

    test('DELETE - Delete user', async ({ request }) => {
        const response = await request.delete(`${baseURL}/users/2`);
        // Reqres delete api returns 204 No Content
        expect(response.status()).toBe(204);
    });
});
