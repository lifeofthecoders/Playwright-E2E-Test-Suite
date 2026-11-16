# Playwright E2E Test Suite - E-Commerce Checkout Flow

An end-to-end (E2E) test suite for a mock e-commerce web application, built with [Playwright](https://playwright.dev/) and the **Page Object Model (POM)**.

The suite validates the complete checkout journey and key failure scenarios, generates debugging artifacts on failure, and supports automated execution through GitHub Actions.

## Objective

This project demonstrates practical QA automation and DevOps testing practices:

- **Playwright** for reliable browser automation with automatic waiting.
- **End-to-end testing** that exercises the application like a real user, from login through order confirmation.
- **Page Object Model** to separate UI locators and page interactions from test logic, keeping test specifications readable and maintainable.
- **CI/CD** with GitHub Actions to execute the test suite automatically on configured pushes and pull requests.
- **Failure artifacts** including screenshots, videos, and traces to help diagnose test failures.

## Application Under Test

**Application Name:** ShopZone E-Commerce Demo

**Live Application:**  
https://shop-zone-ecommerce-demo.vercel.app/

**Application Source Code:**  
https://github.com/lifeofthecoders/ShopZone-Ecommerce-Demo

The ShopZone application is a demonstration e-commerce website used as the application under test for this automation project.

### Application Features

- User login and authentication simulation.
- Product listing and product selection.
- Add-to-cart functionality.
- Shopping cart management.
- Checkout process.
- Order confirmation.
- Cart persistence using localStorage.

## Automation Repository

**GitHub Repository:**  
https://github.com/lifeofthecoders/Playwright-E2E-Test-Suite

This repository contains the Playwright end-to-end automation test suite for validating the ShopZone E-Commerce Demo application.

## Technology Stack

- **Node.js** (v18+ recommended; CI uses Node 20)
- **TypeScript**
- **Playwright** (`@playwright/test`)
- **Page Object Model (POM)**
- **GitHub Actions** (CI/CD)
- **Vite and React** (application under test)

## Project Structure

```text
.
├── tests/
│   ├── pages/                  # Page Object classes
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   └── ConfirmationPage.ts
│   │
│   ├── specs/
│   │   └── checkout.spec.ts    # E2E test scenarios
│   │
│   └── fixtures/
│       └── test-data.ts       # Centralized test data
│
├── .github/
│   └── workflows/
│       └── playwright.yml    # GitHub Actions CI pipeline
│
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
├── .env.example
└── README.md
```

## The Target Application

The test suite supports running against a locally hosted or deployed application through the `BASE_URL` environment variable.

By default, the application is expected to be available at:

```text
http://localhost:8080
```

The live ShopZone application is available at:

```text
https://shop-zone-ecommerce-demo.vercel.app/
```

The application exposes the following pages and `data-testid` attributes:

| Page | Path | Key `data-testid` attributes |
|---|---|---|
| Login | `/login` | `login-email`, `login-password`, `login-submit` |
| Products | `/products` | `product-item-{id}`, `add-to-cart-{id}`, `cart-link`, `logout-button` |
| Cart | `/cart` | `cart-item-{id}`, `checkout-button`, `cart-empty-message` |
| Checkout | `/checkout` | `shipping-address`, `payment-info`, `confirm-purchase-button` |
| Confirmation | `/confirmation` | `order-confirmation-message` |

> This repository contains the automation test suite only. The target application must be available separately before running the tests.

## Prerequisites

- [Node.js](https://nodejs.org/) version 18 or newer.
- npm package manager.
- Playwright browsers installed.
- Access to the target e-commerce application through the configured `BASE_URL`.

## Installation

Clone the repository:

```bash
git clone https://github.com/lifeofthecoders/Playwright-E2E-Test-Suite.git
```

Navigate into the project directory:

```bash
cd Playwright-E2E-Test-Suite
```

Install project dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

For Linux or CI environments, install browsers with their required system dependencies:

```bash
npx playwright install --with-deps
```

Optionally, copy the environment template and adjust the configuration:

```bash
cp .env.example .env
```

## Running Tests

Make sure the target application is running and reachable through `BASE_URL`.

Run the complete test suite:

```bash
npx playwright test
```

Alternatively, use the npm test script:

```bash
npm test
```

### Run Tests Against the Live Application

To execute the tests against the deployed ShopZone application:

```bash
BASE_URL=https://shop-zone-ecommerce-demo.vercel.app npm test
```

This overrides the default local application URL without modifying `playwright.config.ts`.

### TypeScript Validation

Run TypeScript checks:

```bash
npm run typecheck
```

## Headed Mode

Watch the browser while tests execute:

```bash
npx playwright test --headed
```

## Debugging

Run tests using the Playwright Inspector:

```bash
npx playwright test --debug
```

The interactive UI mode is also available:

```bash
npx playwright test --ui
```

## HTML Report

After a test execution, open the generated HTML report:

```bash
npx playwright show-report
```

The report provides details about test execution, including passed and failed test cases.

## Trace Viewer

Traces are configured to be captured on the first retry of a failing test.

Open a trace file using:

```bash
npx playwright show-trace path/to/trace.zip
```

You can also drag and drop a `trace.zip` file into the [Playwright Trace Viewer](https://trace.playwright.dev/).

## Test Scenarios

All three automated scenarios are located in:

```text
tests/specs/checkout.spec.ts
```

The tests interact with the application through Page Objects.

### 1. Successful Checkout

**Test:** `should successfully complete the checkout flow`

Test flow:

1. Log in to the application.
2. Add a product to the cart.
3. Open the shopping cart.
4. Proceed to checkout.
5. Enter shipping and payment details.
6. Confirm the purchase.
7. Verify that the order confirmation message is visible.

**Expected Result:** The checkout process completes successfully and the order confirmation is displayed.

### 2. Empty Cart Checkout Prevention

**Test:** `should display an error when checking out with an empty cart`

Test flow:

1. Log in to the application.
2. Navigate directly to the cart.
3. Attempt to proceed with checkout without adding any products.
4. Verify that the empty cart validation message is displayed.
5. Confirm that the user remains on the cart page.

**Expected Result:** Checkout is prevented and the empty cart validation message is displayed.

### 3. Expired Session and Cart Preservation

**Test:** `should preserve cart contents after session expiry and re-login`

Test flow:

1. Log in to the application.
2. Add product `1` to the cart.
3. Verify that the product is present in the cart.
4. Clear browser cookies to simulate an expired session.
5. Attempt to open `/checkout`.
6. Verify that the application redirects to `/login`.
7. Log in again.
8. Verify that product `1` is still present in the cart.

**Expected Result:** The application requires authentication again while preserving the cart contents after re-login.

## Continuous Integration

The GitHub Actions workflow is located at:

```text
.github/workflows/playwright.yml
```

The workflow is configured to run on pushes and pull requests to the configured branches (`main`/`master`).

The CI pipeline performs the following steps:

1. Checks out the repository.
2. Sets up Node.js with npm caching.
3. Installs project dependencies using `npm ci`.
4. Installs Playwright browsers using `npx playwright install --with-deps`.
5. Executes the test suite using `npx playwright test`.
6. Uploads the `playwright-report/` and `test-results/` directories as build artifacts using `actions/upload-artifact@v4`.

The artifacts are configured with `if: always()` so reports and test results can be preserved even when tests fail.

## Failure Artifacts

The following debugging artifacts are configured in `playwright.config.ts`:

- **Screenshots:** Captured only when a test fails.
- **Videos:** Retained when a test fails.
- **Traces:** Collected on the first retry for debugging.
- **HTML Report:** Generated for test execution results.

Per-test artifacts are stored in:

```text
test-results/
```

The HTML report is stored in:

```text
playwright-report/
```

Both directories are uploaded by the GitHub Actions CI pipeline.

## 💼 Professional Focus

### Beyond Finding Bugs. Building Confidence in Every Release.

I approach quality assurance with one core belief: **A feature is not truly tested until its behaviour, reliability, and impact on the overall user experience are understood.**

My focus goes beyond validating requirements and finding defects. I look at software from three perspectives: the business expectation, the user's actual behaviour, and the risks that could compromise product quality.

**My QA Philosophy**

- **Think in Risks, Not Just Test Cases:** Identify critical workflows, evaluate potential impact, and focus testing where failure matters most.
- **Challenge the Expected Behaviour:** Explore beyond happy paths to uncover hidden defects, boundary conditions, and unexpected scenarios.
- **Understand the User Behind the Feature:** Validate functionality through real-world usage, usability, and end-to-end experience.
- **Make Defects Actionable:** Report issues with precise reproduction steps, meaningful evidence, and clear impact.
- **Protect What Already Works:** Strengthen regression coverage and verify that every change preserves existing functionality.
- **Build Release Confidence:** Combine requirement analysis, structured testing, exploratory investigation, and defect verification to support informed release decisions.

**The Quality Standard I Strive For**

Reliable functionality. Predictable behaviour. Consistent experiences. Fewer surprises. Greater user confidence.

I aim to contribute to engineering teams where QA is not simply the final checkpoint, but an active part of product thinking, development decisions, and continuous quality improvement.

## 📄 License & Ownership

This project is a personal QA automation project developed for professional learning, demonstration, and portfolio purposes.

Original project documentation, test implementations, and other materials created for this repository belong to the author, subject to the repository's MIT License.

Third-party libraries, frameworks, tools, and dependencies remain subject to their respective licenses and terms of use.

The MIT License governs the use, modification, and redistribution of this repository's licensed code.

## 📫 Connect With Me

If you'd like to connect, collaborate, or discuss QA, software testing, and test automation, feel free to reach out.

**Sumit Panchal**  
**Senior Quality Analyst | Manual QA Engineer | Software Testing | 5+ Years Experience**

📍 **Location:** Ahmedabad, Gujarat, India

🌐 **Portfolio:** [https://lifeofthecoders.github.io/Sumit_Panchal_QA_Portfolio_Series/](https://lifeofthecoders.github.io/Sumit_Panchal_QA_Portfolio_Series/)

💻 **GitHub:** [https://github.com/lifeofthecoders/Playwright-E2E-Test-Suite](https://github.com/lifeofthecoders/Playwright-E2E-Test-Suite)

📧 **Email:** sumitpanchal5225@gmail.com

🔗 **LinkedIn:** [linkedin.com/in/sumit-panchal-b790a8236](https://www.linkedin.com/in/sumit-panchal-b790a8236/)

## ⭐ Support

If you found this portfolio useful, please consider giving the repository a ⭐ star. Your support and feedback are greatly appreciated and help encourage continuous improvement.

<div align="center">

**QUALITY IS MY COMMITMENT.  
RELIABILITY IS MY STANDARD.**

Thank you for visiting my portfolio!

---

**Designed and developed by Sumit Panchal.**

**PRECISION. QUALITY. TRUST. DELIVERED.**

© 2026 Sumit Panchal. All rights reserved for the custom portfolio implementation, subject to the notices above.

</div>

---

**Note:** ShopZone is a demonstration application. Authentication and payment are simulated. No real payment is processed.