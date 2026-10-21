import { test, expect, Page } from '@playwright/test';

const baseURL = 'https://reqres.in/api';
const corsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
};

async function mockResponse(
    page: Page,
    path: string,
    status: number,
    body: unknown,
    expectedMethod = 'GET',
    expectedRequestBody?: unknown
) {
    const url = `${baseURL}${path}`;

    await page.route(
        (requestUrl) => requestUrl.href === url,
        async (route) => {
            if (route.request().method() === 'OPTIONS') {
                await route.fulfill({ status: 204, headers: corsHeaders });
                return;
            }

            expect(route.request().method()).toBe(expectedMethod);
            if (expectedRequestBody !== undefined) {
                expect(route.request().postDataJSON()).toEqual(expectedRequestBody);
            }

            await route.fulfill({
                status,
                headers: corsHeaders,
                contentType: 'application/json',
                ...(status === 204 ? {} : { body: JSON.stringify(body) }),
            });
        }
    );
}

async function apiFetch(page: Page, path: string, method = 'GET', data?: unknown) {
    return page.evaluate(async ({ url, method, data }) => {
        const response = await fetch(url, {
            method,
            headers: data === undefined ? undefined : { 'content-type': 'application/json' },
            body: data === undefined ? undefined : JSON.stringify(data),
        });
        const text = await response.text();

        return {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            body: text ? JSON.parse(text) : null,
        };
    }, { url: `${baseURL}${path}`, method, data });
}

test.describe('API Testing Reqres.in with deterministic responses', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('about:blank');
    });

    test('GET - Get list of users', { tag: '@smoke' }, async ({ page }) => {
        await mockResponse(page, '/users?page=2', 200, {
            page: 2,
            data: [{ id: 7, first_name: 'Michael', last_name: 'Lawson' }],
        });

        const response = await apiFetch(page, '/users?page=2');
        expect(response.status).toBe(200);
        expect(response.body.page).toBe(2);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('GET - Get single user', async ({ page }) => {
        await mockResponse(page, '/users/2', 200, {
            data: { id: 2, first_name: 'Janet' },
        });

        const response = await apiFetch(page, '/users/2');
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(2);
        expect(response.body.data.first_name).toBe('Janet');
    });

    test('GET - Get first page with pagination metadata and unique users', async ({ page }) => {
        const users = [
            { id: 1, email: 'george.bluth@reqres.in', first_name: 'George', last_name: 'Bluth' },
            { id: 2, email: 'janet.weaver@reqres.in', first_name: 'Janet', last_name: 'Weaver' },
            { id: 3, email: 'emma.wong@reqres.in', first_name: 'Emma', last_name: 'Wong' },
            { id: 4, email: 'eve.holt@reqres.in', first_name: 'Eve', last_name: 'Holt' },
            { id: 5, email: 'charles.morris@reqres.in', first_name: 'Charles', last_name: 'Morris' },
            { id: 6, email: 'tracey.ramos@reqres.in', first_name: 'Tracey', last_name: 'Ramos' },
        ];
        await mockResponse(page, '/users?page=1', 200, {
            page: 1,
            per_page: 6,
            total: 12,
            total_pages: 2,
            data: users,
        });

        const response = await apiFetch(page, '/users?page=1');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
        expect(response.body.page).toBe(1);
        expect(response.body.per_page).toBe(6);
        expect(response.body.total).toBeGreaterThanOrEqual(response.body.data.length);
        expect(response.body.total_pages).toBe(2);
        expect(response.body.data).toHaveLength(6);
        expect(new Set(response.body.data.map((user: { id: number }) => user.id)).size).toBe(6);
        expect(response.body.data[0]).toMatchObject({
            id: 1,
            email: 'george.bluth@reqres.in',
            first_name: 'George',
            last_name: 'Bluth',
        });
    });

    test('GET - Return not found for a user that does not exist', async ({ page }) => {
        await mockResponse(page, '/users/23', 404, {});

        const response = await apiFetch(page, '/users/23');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });

    test('GET - Get a paginated list of colors', async ({ page }) => {
        await mockResponse(page, '/unknown?page=2', 200, {
            page: 2,
            data: [
                { id: 7, name: 'sand dollar', year: 2006, color: '#DECDBE' },
                { id: 8, name: 'space grey', year: 2004, color: '#A5A5A5' },
                { id: 9, name: 'aqua sky', year: 2003, color: '#7BC4C4' },
                { id: 10, name: 'fuchsia rose', year: 2002, color: '#C74375' },
                { id: 11, name: 'true red', year: 2001, color: '#BF1932' },
                { id: 12, name: 'blue turquoise', year: 2000, color: '#53B0AE' },
            ],
        });

        const response = await apiFetch(page, '/unknown?page=2');
        expect(response.status).toBe(200);
        expect(response.body.page).toBe(2);
        expect(response.body.data).toHaveLength(6);
        expect(response.body.data[0]).toMatchObject({
            id: 7,
            name: 'sand dollar',
            year: 2006,
            color: '#DECDBE',
        });
    });

    test('GET - Get a single color resource', async ({ page }) => {
        const color = {
            id: 2,
            name: 'fuchsia rose',
            year: 2001,
            color: '#C74375',
            pantone_value: '17-2031',
        };
        await mockResponse(page, '/unknown/2', 200, { data: color });

        const response = await apiFetch(page, '/unknown/2');
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(color);
    });

    test('GET - Return not found for an unknown resource', async ({ page }) => {
        await mockResponse(page, '/unknown/23', 404, {});

        const response = await apiFetch(page, '/unknown/23');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
    });

    test('POST - Login successfully with valid credentials', async ({ page }) => {
        const payload = { email: 'eve.holt@reqres.in', password: 'pistol' };
        await mockResponse(page, '/login', 200, { token: 'mock-auth-token' }, 'POST', payload);

        const response = await apiFetch(page, '/login', 'POST', payload);
        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
    });

    test('POST - Reject login when password is missing', async ({ page }) => {
        const payload = { email: 'peter@klaven' };
        await mockResponse(page, '/login', 400, { error: 'Missing password' }, 'POST', payload);

        const response = await apiFetch(page, '/login', 'POST', payload);
        expect(response.status).toBe(400);
    });

    test('POST - Reject registration when password is missing', async ({ page }) => {
        const payload = { email: 'sydney@fife' };
        await mockResponse(page, '/register', 400, { error: 'Missing password' }, 'POST', payload);

        const response = await apiFetch(page, '/register', 'POST', payload);
        expect(response.status).toBe(400);
    });

    test('POST - Create new user', async ({ page }) => {
        const payload = { name: 'Morpheus', job: 'Leader' };
        await mockResponse(page, '/users', 201, {
            ...payload,
            id: '123',
            createdAt: '2026-01-01T00:00:00.000Z',
        }, 'POST', payload);

        const response = await apiFetch(page, '/users', 'POST', payload);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(payload.name);
        expect(response.body.job).toBe(payload.job);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('createdAt');
    });

    test('PUT - Update user data', async ({ page }) => {
        const payload = { name: 'Morpheus', job: 'Zion Resident' };
        await mockResponse(page, '/users/2', 200, {
            ...payload,
            updatedAt: '2026-01-01T00:00:00.000Z',
        }, 'PUT', payload);

        const response = await apiFetch(page, '/users/2', 'PUT', payload);
        expect(response.status).toBe(200);
        expect(response.body.job).toBe(payload.job);
        expect(response.body).toHaveProperty('updatedAt');
    });

    test('PATCH - Update only the provided user field', async ({ page }) => {
        const payload = { job: 'Architect' };
        await mockResponse(page, '/users/2', 200, {
            ...payload,
            updatedAt: '2026-01-01T00:00:00.000Z',
        }, 'PATCH', payload);

        const response = await apiFetch(page, '/users/2', 'PATCH', payload);
        expect(response.status).toBe(200);
        expect(response.body.job).toBe(payload.job);
        expect(response.body).toHaveProperty('updatedAt');
        expect(response.body).not.toHaveProperty('name');
    });

    test('DELETE - Delete user', async ({ page }) => {
        await mockResponse(page, '/users/2', 204, undefined, 'DELETE');

        const response = await apiFetch(page, '/users/2', 'DELETE');
        expect(response.status).toBe(204);
        expect(response.body).toBeNull();
    });
});
