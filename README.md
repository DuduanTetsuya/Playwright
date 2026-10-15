# Playwright
Repository for Automation training using Playwright.

Steps to run the tests:
1. Install node.js
2. Clone the repository: https://github.com/DuduanTetsuya/Playwright.git
3. Open the cloned repository in Visual Studio Code
4. Install dependencies: `npm ci`
5. Install Playwright browsers: `npx playwright install`
6. Run the UI tests: `npx playwright test tests/ui`
7. Run SauceDemo tests only: `npx playwright test tests/ui/saucedemo`
8. Run OrangeHRM tests only: `npx playwright test tests/ui/orangehrm`
9. Run API tests: `npx playwright test tests/api`

See the [test catalog](docs/test-catalog.md) for the full list of test cases and what each one verifies.
