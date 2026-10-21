# Test Catalog

This catalog describes the automated test coverage in this repository.

Reusable scenario data for SauceDemo and OrangeHRM login tests and SauceDemo checkout validation is stored in `testdata/` and imported by the corresponding specs.

The successful SauceDemo login, successful OrangeHRM login, and Reqres user-list tests are tagged `@smoke`. The `daily-smoke.yml` workflow runs these smoke tests daily at 07:00 UTC+7. The `run-selection.yml` workflow supports running all tests, API, UI, either UI application, or a custom test path with 1–5 workers. Both workflows upload HTML and JSON reports and send the result to Slack; configure the repository Actions secret `SLACK_WEBHOOK_URL` to enable delivery.

| Suite | Test count |
|---|---:|
| SauceDemo UI | 31 |
| OrangeHRM UI | 11 |
| Reqres API | 15 |
| **Total** | **57** |

## SauceDemo UI

### Login — `tests/ui/saucedemo/login.spec.ts`

| Test | What it verifies |
|---|---|
| User can login successfully with valid credentials | A valid user can sign in and reach the inventory page. |
| User should not able to login with locked out user | A locked-out account is rejected with the expected error message. |
| User should not able to login with invalid credentials | Invalid username and password are rejected with the expected error message. |
| User should not able to login with empty username | Submitting without a username shows the required-username error. |
| User should not able to login with empty password | Submitting without a password shows the required-password error. |
| Password field masks entered credentials | The password input uses a masked password field. |
| User can dismiss a login error message | The close control dismisses the displayed authentication error. |

### Inventory — `tests/ui/saucedemo/inventory.spec.ts`

| Test | What it verifies |
|---|---|
| User can add item to cart | Adding the backpack updates the cart badge to one item. |
| User can remove item from cart | Removing the bike light clears the cart badge. |
| User can add products at odd positions to cart | Products in odd-numbered inventory positions are added; cart count and names are verified. |
| User can add products at even positions to cart | Products in even-numbered inventory positions are added; cart count and names are verified. |
| User can sort items by price (low to high) | Inventory prices are sorted in ascending order. |
| User can sort items by price (high to low) | Inventory prices are sorted in descending order. |
| User can sort items by name (A to Z) | Inventory names are sorted alphabetically ascending. |
| User can sort items by name (Z to A) | Inventory names are sorted alphabetically descending. |
| Inventory displays all six products with a name and price | The catalog contains six products, each with a name, description, and price. |
| Removing one product keeps the other cart products selected | Removing one of two products updates the cart badge and leaves the other product in the cart. |
| User can reset cart state from the menu | Resetting app state clears the cart badge. |
| User can open a product and return to inventory | Product details show the selected product's name, description, and price, and the back action returns to inventory. |
| User can log out from the inventory menu | Logging out returns to the login form. |

### Cart — `tests/ui/saucedemo/cart.spec.ts`

| Test | What it verifies |
|---|---|
| User can view an empty cart | The cart page loads with no cart items and the checkout control. |
| User can remove a product from the cart | Removing the only item empties the cart and hides the cart badge. |
| User can continue shopping from the cart | Continue shopping returns the user to inventory. |
| User can proceed from the cart to checkout information | Checkout opens the required customer information fields. |

### Checkout — `tests/ui/saucedemo/checkout.spec.ts`

| Test | What it verifies |
|---|---|
| Checkout requires a first name | An empty first name is rejected with its required-field error. |
| Checkout requires a last name after first name is provided | An empty last name is rejected with its required-field error. |
| Checkout requires a postal code after names are provided | An empty postal code is rejected with its required-field error. |
| User can cancel checkout information and return to the cart | Canceling the information step returns to the cart with its product retained. |
| User can review order totals before completing checkout | Subtotal, tax, total, payment, and shipping details are displayed as expected. |
| User can cancel checkout overview and return to inventory | Canceling the overview returns to inventory with the cart item retained. |
| User can complete checkout and return to inventory with an empty cart | A successful order can be completed and leaves inventory with no cart badge. |

## OrangeHRM UI

### Login — `tests/ui/orangehrm/login.spec.ts`

| Test | What it verifies |
|---|---|
| User can login successfully with valid credentials | Valid credentials open the OrangeHRM dashboard. |
| User should not able to login with invalid credentials | Invalid credentials are rejected with the expected error message. |

### Admin — `tests/ui/orangehrm/admin.spec.ts`

| Test | What it verifies |
|---|---|
| User can search for an existing admin user | Searching for the Admin username returns a record. |
| User sees no records when searching for a nonexistent username | A unique nonexistent username returns an empty result. |

### Leave — `tests/ui/orangehrm/leave.spec.ts`

| Test | What it verifies |
|---|---|
| User can navigate to Leave List | The Leave List page opens from the Leave module. |
| User can open the Apply Leave page | The Apply Leave page opens and displays its available page state. |

### PIM — `tests/ui/orangehrm/pim.spec.ts`

| Test | What it verifies |
|---|---|
| User can add a new employee | A new employee can be saved and their personal details are displayed. |
| User sees required-field errors when adding an employee without required details | Saving without first and last names shows the required-field validation errors. |
| User can search for and delete the employee they created | The test-created employee can be found, deleted, and verified absent from results. |

### Recruitment — `tests/ui/orangehrm/recruitment.spec.ts`

| Test | What it verifies |
|---|---|
| User can add a new job candidate | A candidate with unique details can be saved successfully. |
| User sees required-field errors when candidate details are missing | Saving an empty candidate form shows required-field validation errors. |

## Reqres API

### Users — `tests/api/reqres.spec.ts`

| Test | What it verifies |
|---|---|
| GET - Get list of users | The users endpoint returns HTTP 200, the requested page number, and a non-empty user list. |
| GET - Get single user | The single-user endpoint returns HTTP 200 and the expected user ID and first name. |
| GET - Get first page with pagination metadata and unique users | Page size, pagination metadata, JSON content type, unique user IDs, and the first user's fields are correct. |
| GET - Return not found for a user that does not exist | A missing user returns HTTP 404 with an empty JSON object. |
| GET - Get a paginated list of colors | The resources endpoint returns page two and the expected first color. |
| GET - Get a single color resource | The resource endpoint returns the expected color details. |
| GET - Return not found for an unknown resource | A missing resource returns HTTP 404 with an empty JSON object. |
| POST - Login successfully with valid credentials | Valid sample credentials return HTTP 200 and an authentication token. |
| POST - Reject login when password is missing | Login without a password returns HTTP 400. |
| POST - Reject registration when password is missing | Registration without a password returns HTTP 400. |
| POST - Create new user | The create endpoint returns HTTP 201 and echoes the submitted name and job with an ID and creation timestamp. |
| PUT - Update user data | The update endpoint returns HTTP 200 and the updated job with an update timestamp. |
| PATCH - Update only the provided user field | A partial update returns HTTP 200 with the changed field and an update timestamp. |
| DELETE - Delete user | The delete endpoint returns HTTP 204. |

### Network interception — `tests/api/reqres-network.spec.ts`

| Test | What it verifies |
|---|---|
| Intercept a browser API request and return a mocked user response | Playwright intercepts a browser `fetch`, validates the outgoing method and URL, and returns a deterministic mocked JSON response without calling the live endpoint. |
