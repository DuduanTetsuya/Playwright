import { test, expect, Page, Route } from '@playwright/test';

const API = 'https://reqres.in/api';

const CORS = {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

// Fulfill with CORS headers so the page (different origin) may read the mocked response.
const fulfillJson = (route: Route, body: unknown, status = 200) =>
    route.fulfill({
        status,
        contentType: 'application/json',
        headers: CORS,
        body: JSON.stringify(body),
    });

// Answer CORS preflight requests; returns true when handled.
const handlePreflight = async (route: Route) => {
    if (route.request().method() !== 'OPTIONS') return false;
    await route.fulfill({ status: 204, headers: CORS });
    return true;
};

// Run fetch inside the page so the request goes through page.route interception.
const browserFetch = (page: Page, url: string, init?: RequestInit) =>
    page.evaluate(
        async ({ url, init }) => {
            const res = await fetch(url, init);
            const text = await res.text();
            let json: any = null;
            try { json = JSON.parse(text); } catch { /* not JSON */ }
            return { status: res.status, json, text };
        },
        { url, init }
    );

test.describe('API Intercept (page.route)', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('https://playwright.test/**', (route) =>
            route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body></body></html>' })
        );
        await page.goto('https://playwright.test/');
    });

    test('Mock GET - fulfill users list with custom data', async ({ page }) => {
        const mockUsers = {
            page: 1,
            data: [{ id: 99, first_name: 'Mock', last_name: 'User', email: 'mock@test.com' }],
        };

        await page.route(`${API}/users*`, async (route) => {
            if (await handlePreflight(route)) return;
            await fulfillJson(route, mockUsers);
        });

        const res = await browserFetch(page, `${API}/users?page=1`);

        expect(res.status).toBe(200);
        expect(res.json.data).toHaveLength(1);
        expect(res.json.data[0].first_name).toBe('Mock');
    });

    test('Mock error - simulate 500 Internal Server Error', async ({ page }) => {
        await page.route(`${API}/users/2`, async (route) => {
            if (await handlePreflight(route)) return;
            await fulfillJson(route, { error: 'Internal Server Error' }, 500);
        });

        const res = await browserFetch(page, `${API}/users/2`);

        expect(res.status).toBe(500);
        expect(res.json.error).toBe('Internal Server Error');
    });

    test('Mock error - simulate 404 Not Found', async ({ page }) => {
        await page.route(`${API}/users/23`, async (route) => {
            if (await handlePreflight(route)) return;
            await fulfillJson(route, {}, 404);
        });

        const res = await browserFetch(page, `${API}/users/23`);

        expect(res.status).toBe(404);
        expect(res.json).toEqual({});
    });

    test('Abort request - simulate network failure', async ({ page }) => {
        await page.route(`${API}/users*`, (route) => route.abort('connectionrefused'));

        const outcome = await page.evaluate(async (url) => {
            try {
                await fetch(url);
                return 'resolved';
            } catch {
                return 'rejected';
            }
        }, `${API}/users`);

        expect(outcome).toBe('rejected');
    });

    test('Capture request - verify POST payload and headers sent', async ({ page }) => {
        const payload = { name: 'Morpheus', job: 'Leader' };
        let captured: { method: string; body: any; contentType: string | undefined } | undefined;

        await page.route(`${API}/users`, async (route) => {
            if (await handlePreflight(route)) return;
            const req = route.request();
            captured = {
                method: req.method(),
                body: req.postDataJSON(),
                contentType: req.headers()['content-type'],
            };
            await fulfillJson(route, { ...payload, id: '123', createdAt: '2026-01-01T00:00:00.000Z' }, 201);
        });

        const res = await browserFetch(page, `${API}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        expect(captured?.method).toBe('POST');
        expect(captured?.body).toEqual(payload);
        expect(captured?.contentType).toContain('application/json');
        expect(res.status).toBe(201);
        expect(res.json.id).toBe('123');
    });

    test('Modify request - inject header via route.fallback chain', async ({ page }) => {
        let seenHeader: string | undefined;

        // Registered first => runs second: sees the header injected by the handler below.
        await page.route(`${API}/users/2`, async (route) => {
            if (await handlePreflight(route)) return;
            seenHeader = route.request().headers()['x-test-intercept'];
            await fulfillJson(route, { data: { id: 2 } });
        });

        // Registered last => runs first: adds the header and passes the request on.
        await page.route(`${API}/users/2`, async (route) => {
            if (await handlePreflight(route)) return;
            await route.fallback({ headers: { ...route.request().headers(), 'x-test-intercept': 'yes' } });
        });

        const res = await browserFetch(page, `${API}/users/2`);

        expect(res.status).toBe(200);
        expect(seenHeader).toBe('yes');
    });

    test('Modify response - change JSON returned by the intercepted API', async ({ page }) => {
        await page.route(`${API}/users/2`, async (route) => {
            if (await handlePreflight(route)) return;
            const json = {
                data: {
                    id: 2,
                    email: 'janet.weaver@reqres.in',
                    first_name: 'Janet',
                    last_name: 'Weaver',
                },
            };
            json.data.first_name = 'Intercepted';
            await fulfillJson(route, json);
        });

        const res = await browserFetch(page, `${API}/users/2`);

        expect(res.status).toBe(200);
        expect(res.json.data.first_name).toBe('Intercepted');
    });

    test('Delay response - simulate slow API', async ({ page }) => {
        const delayMs = 1500;

        await page.route(`${API}/users/2`, async (route) => {
            if (await handlePreflight(route)) return;
            await new Promise((r) => setTimeout(r, delayMs));
            await fulfillJson(route, { data: { id: 2 } });
        });

        const start = Date.now();
        const res = await browserFetch(page, `${API}/users/2`);
        const elapsed = Date.now() - start;

        expect(res.status).toBe(200);
        expect(elapsed).toBeGreaterThanOrEqual(delayMs);
    });

    test('Wait for response - waitForResponse on intercepted call', async ({ page }) => {
        await page.route(`${API}/users*`, async (route) => {
            if (await handlePreflight(route)) return;
            await fulfillJson(route, { page: 2, data: [] });
        });

        const [response] = await Promise.all([
            page.waitForResponse((r) => r.url().includes('/api/users') && r.request().method() === 'GET'),
            browserFetch(page, `${API}/users?page=2`),
        ]);

        expect(response.status()).toBe(200);
        expect((await response.json()).page).toBe(2);
    });

    test('Unroute - mock is removed after page.unroute', async ({ page }) => {
        const handler = async (route: Route) => {
            if (await handlePreflight(route)) return;
            await fulfillJson(route, { mocked: true });
        };

        await page.route(`${API}/users/2`, handler);
        const mocked = await browserFetch(page, `${API}/users/2`);
        expect(mocked.json.mocked).toBe(true);

        await page.unroute(`${API}/users/2`, handler);
        let routeHit = false;
        await page.route(`${API}/users/2`, async (route) => {
            routeHit = true;
            if (await handlePreflight(route)) return;
            await fulfillJson(route, { mocked: false });
        });
        const after = await browserFetch(page, `${API}/users/2`);

        expect(routeHit).toBe(true);
        expect(after.json.mocked).toBe(false);
    });

    test('Block resources - abort images/fonts/media, continue the rest', async ({ page }) => {
        const blocked: string[] = [];
        const pageHtml = `
            <!doctype html>
            <html>
              <head>
                <style>
                  @font-face {
                    font-family: "InterceptedFont";
                    src: url("https://playwright.test/test.woff2") format("woff2");
                  }
                  h1 { font-family: "InterceptedFont"; }
                </style>
              </head>
              <body>
                <h1>Resource blocking works</h1>
                <img src="https://playwright.test/test.png" alt="test image">
                <video autoplay muted preload="auto" src="https://playwright.test/test.mp4"></video>
              </body>
            </html>`;

        await page.route('**/*', (route) => {
            const type = route.request().resourceType();
            if (['image', 'font', 'media'].includes(type)) {
                blocked.push(type);
                return route.abort();
            }
            if (type === 'document') {
                return route.fulfill({ contentType: 'text/html', body: pageHtml });
            }
            return route.continue();
        });

        await page.goto('https://playwright.test/resources');
        await expect(page.locator('h1')).toHaveText('Resource blocking works');
        await page.evaluate(() => document.fonts.ready);
        await expect.poll(() => [...new Set(blocked)].sort()).toEqual(['font', 'image', 'media']);
    });
});
