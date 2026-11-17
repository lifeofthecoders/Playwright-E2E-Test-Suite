# Playwright E2E Test Suite - E-Commerce Checkout Flow

An end-to-end (E2E) test suite for the ShopZone demonstration e-commerce application, built with [Playwright](https://playwright.dev/) and the **Page Object Model (POM)**.

The suite validates the checkout journey and key failure scenarios, captures debugging artifacts when tests fail, and supports automated execution through GitHub Actions.

## Objective

This project demonstrates practical QA automation and DevOps testing practices:

- **Playwright** for reliable browser automation with automatic waiting.
- **End-to-end testing** that exercises the application like a real user, from login through order confirmation.
- **Page Object Model** to separate UI locators and page interactions from test logic, keeping test specifications readable and maintainable.
- **CI/CD** with GitHub Actions to execute the test suite automatically on configured pushes and pull requests.
- **Failure artifacts** including screenshots, videos, and traces to help diagnose test failures.

## Application Under Test

**Application:** ShopZone E-Commerce Demo  
**Live application:** https://shop-zone-ecommerce-demo.vercel.app/  
**Application source code:** https://github.com/lifeofthecoders/ShopZone-Ecommerce-Demo

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

**GitHub repository:** https://github.com/lifeofthecoders/Playwright-E2E-Test-Suite

This repository contains the Playwright end-to-end automation test suite for validating the ShopZone E-Commerce Demo application. The React application and the Playwright automation suite are maintained in separate repositories and local folders.

## Technology Stack

- **Node.js** (v18+ recommended; CI uses Node 20)
- **TypeScript**
- **Playwright** (`@playwright/test`)
- **Page Object Model (POM)**
- **GitHub Actions** (CI/CD)
- **Vite and React** (application under test)

## Project Structure

```text
Playwright-E2E-Test-Suite/
├── tests/
│   ├── pages/                   # Page Object classes
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   └── ConfirmationPage.ts
│   ├── specs/
│   │   └── checkout.spec.ts     # E2E test scenarios
│   └── fixtures/
│       └── test-data.ts         # Centralized test data
├── scripts/
│   └── publish-live-report.mjs  # Publishes and opens the GitHub Pages report
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI pipeline
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
├── .env.example
└── README.md
```

## The Target Application

The test suite supports running against either the locally hosted application or the deployed application by using the `BASE_URL` environment variable.

| Environment | Application URL | Browser execution |
|---|---|---|
| Local | `http://127.0.0.1:5173` | Visible Google Chrome on your computer |
| Live | `https://shop-zone-ecommerce-demo.vercel.app` | Visible Google Chrome on your computer |
| GitHub Actions | `https://shop-zone-ecommerce-demo.vercel.app` | Headless Chromium on the GitHub runner |

The local React application is in the sibling folder `ecommerce-demo-app`. The Playwright test suite is in `Playwright-E2E-Test-Suite`.

The application exposes the following pages and `data-testid` attributes:

| Page | Path | Key `data-testid` attributes |
|---|---|---|
| Login | `/login` | `login-email`, `login-password`, `login-submit` |
| Products | `/products` | `product-item-{id}`, `add-to-cart-{id}`, `cart-link`, `logout-button` |
| Cart | `/cart` | `cart-item-{id}`, `checkout-button`, `cart-empty-message` |
| Checkout | `/checkout` | `shipping-address`, `payment-info`, `confirm-purchase-button` |
| Confirmation | `/confirmation` | `order-confirmation-message` |

> This repository contains the automation test suite only. The target application is maintained separately. For local testing, run the React application from the `ecommerce-demo-app` folder.

## Prerequisites

- [Node.js](https://nodejs.org/) version 18 or newer.
- npm package manager.
- Google Chrome installed locally (the local configuration uses the installed Chrome browser).
- Playwright browser dependencies installed for the local environment and CI.
- Access to the target application through the configured `BASE_URL`.
- GitHub CLI (`gh`) installed and authenticated if you want to publish the Live report using `npm run test:report:live`.

## Installation

Clone the automation repository:

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
npx playwright install --with-deps chromium
```

Optionally, copy the environment template and adjust the configuration:

```bash
cp .env.example .env
```

## Run the Tests

The project supports two execution environments: **Local** and **Live**. Both commands run the test cases in a visible Google Chrome browser on your computer.

### Local Environment – Visible Chrome Execution

Use two Git Bash terminals so that the React application and the Playwright test suite run separately.

**Terminal 1 – Start the React application**

```bash
cd /c/Projects/ecommerce-demo-app
npm run dev
```

Keep this terminal running. Vite should make the application available at `http://127.0.0.1:5173`.

**Terminal 2 – Run the Playwright suite**

```bash
cd /c/Projects/Playwright-E2E-Test-Suite

BASE_URL=http://127.0.0.1:5173 npm test
```

Playwright opens Google Chrome and executes the test cases against your local React application.

When the test run finishes, open the locally generated HTML report:

```bash
npm run test:report
```

The local HTML report is served by Playwright, usually at `http://localhost:9323`.

> The Playwright configuration can also start the local Vite server automatically when it is not already running. Starting it in Terminal 1 is shown here to make the two-project run structure clear. If the server is already running, Playwright reuses it.

### Live Environment – Visible Chrome Execution

Run the tests against the deployed ShopZone application:

```bash
cd /c/Projects/Playwright-E2E-Test-Suite

BASE_URL=https://shop-zone-ecommerce-demo.vercel.app npm test
```

Playwright opens Google Chrome on your computer and executes the test cases against the live Vercel application. No local React development server is required for this run.

After the local visible test run finishes, publish the GitHub Actions report and open the public report:

```bash
npm run test:report:live
```

This command uses the GitHub CLI to trigger the existing GitHub Actions workflow, waits for the workflow and GitHub Pages deployment, and opens the public report:

**Live HTML report:** https://lifeofthecoders.github.io/Playwright-E2E-Test-Suite/

> **Important:** The visible Live test run and the GitHub Actions report run are separate executions. The first command runs the tests in Google Chrome on your computer. The `test:report:live` command triggers GitHub Actions, which re-runs the tests headlessly using the code committed and pushed to the `main` branch, then publishes that CI run's HTML report. Push the latest test changes to `main` before publishing if you want the public report to reflect those changes.

### Run Without Specifying `BASE_URL`

The configuration defaults to the live ShopZone application when `BASE_URL` is not supplied:

```bash
npm test
```

For clarity and repeatability, use the explicit Local or Live commands above when running tests manually.

## TypeScript Validation

Run TypeScript checks:

```bash
npm run typecheck
```

## Headed Mode and Debugging

The regular `npm test` command already runs in headed mode. To run Playwright directly in headed mode:

```bash
npm run test:headed
```

Run tests using the Playwright Inspector:

```bash
npm run test:debug
```

The interactive UI mode is also available:

```bash
npm run test:ui
```

## HTML Reports

### Local HTML Report

After running the tests locally, open the generated report:

```bash
npm run test:report
```

This starts Playwright's local HTML report viewer. It is normally served at `http://localhost:9323` and shows details about the local test execution, including passed and failed test cases.

### Public Live HTML Report

To trigger the GitHub Actions workflow and publish its HTML report to GitHub Pages:

```bash
npm run test:report:live
```

The public report URL is:

https://lifeofthecoders.github.io/Playwright-E2E-Test-Suite/

`npx playwright show-report` (also used by `npm run test:report`) is a local report server. It does not serve the GitHub Pages URL. Use `npm run test:report:live` to trigger publication and open the public report.

## Trace Viewer

Traces are configured to be retained when a test fails. Open a trace file using:

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

**Expected result:** The checkout process completes successfully and the order confirmation is displayed.

### 2. Empty Cart Checkout Prevention

**Test:** `should display an error when checking out with an empty cart`

Test flow:

1. Log in to the application.
2. Navigate directly to the cart.
3. Attempt to proceed with checkout without adding any products.
4. Verify that the empty cart validation message is displayed.
5. Confirm that the user remains on the cart page.

**Expected result:** Checkout is prevented and the empty cart validation message is displayed.

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

**Expected result:** The application requires authentication again while preserving the cart contents after re-login.

## Continuous Integration and Live Report Publishing

The GitHub Actions workflow is located at:

```text
.github/workflows/playwright.yml
```

The workflow runs on pushes and pull requests to `main`, and can also be started manually using `workflow_dispatch`.

The CI pipeline performs the following steps:

1. Checks out the automation repository.
2. Sets up Node.js and npm caching.
3. Installs project dependencies using `npm ci`.
4. Installs Playwright Chromium and its system dependencies.
5. Runs TypeScript validation using `npm run typecheck`.
6. Executes the tests using `npm run test:ci` in headless mode against the live ShopZone application.
7. Uploads the `playwright-report/` and `test-results/` directories as workflow artifacts.
8. Deploys the HTML report to GitHub Pages for non-pull-request runs.

The report deployment job publishes the CI-generated report to:

https://lifeofthecoders.github.io/Playwright-E2E-Test-Suite/

The CI workflow uses `npm run test:ci` rather than `npm test` so that the GitHub runner executes headlessly. Local `npm test` uses visible Google Chrome.

## Failure Artifacts

The following debugging artifacts are configured in `playwright.config.ts`:

- **Screenshots:** Captured only when a test fails.
- **Videos:** Retained when a test fails.
- **Traces:** Retained when a test fails.
- **HTML report:** Generated for test execution results.

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
🌐 **Portfolio:** https://lifeofthecoders.github.io/Sumit_Panchal_QA_Portfolio_Series/  
💻 **GitHub:** https://github.com/lifeofthecoders/Playwright-E2E-Test-Suite  
📧 **Email:** sumitpanchal5225@gmail.com  
🔗 **LinkedIn:** https://www.linkedin.com/in/sumit-panchal-b790a8236/

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
