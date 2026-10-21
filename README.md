# Playwright
Repository for Automation training using Playwright.

Steps to run the tests:
1. Install node.js
2. Clone the repository: https://github.com/DuduanTetsuya/Playwright.git
3. Open the cloned repository in Visual Studio Code
4. Install dependencies: `npm ci`
5. Install Playwright browsers: `npx playwright install`
6. Run all UI tests: `npx playwright test tests/ui`
7. Run all SauceDemo UI tests: `npm run test:saucedemo`
8. Run all OrangeHRM UI tests: `npm run test:orangehrm`
9. Run all API tests: `npm run test:api`

See the [test catalog](docs/test-catalog.md) for the full list of test cases and what each one verifies.
