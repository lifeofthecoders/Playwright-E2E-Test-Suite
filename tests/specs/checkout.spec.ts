
import { test, expect, type Page } from "@playwright/test";

import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { ConfirmationPage } from "../pages/ConfirmationPage";

import {
  testUser,
  testProduct,
  checkoutData,
} from "../fixtures/test-data";

/**
 * Create all Page Objects for the current browser page.
 */
function createPages(page: Page) {
  return {
    loginPage: new LoginPage(page),
    productsPage: new ProductsPage(page),
    cartPage: new CartPage(page),
    checkoutPage: new CheckoutPage(page),
    confirmationPage: new ConfirmationPage(page),
  };
}

/**
 * Reusable login helper.
 */
async function loginAsTestUser(
  loginPage: LoginPage
): Promise<void> {
  await loginPage.goto();

  await loginPage.login(
    testUser.email,
    testUser.password
  );
}

test.describe("E-Commerce Checkout Flow", () => {

  /**
   * Reset browser state before every test.
   */
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();

    await page.goto("/");

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Reload with clean browser storage.
    await page.reload();
  });

  /**
   * TEST CASE 1:
   * Successfully complete checkout using Card or Cash.
   */
  test("should successfully complete the checkout flow", async ({
    page,
  }) => {
    const {
      loginPage,
      productsPage,
      cartPage,
      checkoutPage,
      confirmationPage,
    } = createPages(page);

    // 1. Login
    await loginAsTestUser(loginPage);

    await expect(page).toHaveURL(/\/products/);

    // 2. Add product to cart
    await productsPage.addProductToCart(
      testProduct.id
    );

    // 3. Navigate to cart
    await productsPage.goToCart();

    await expect(page).toHaveURL(/\/cart/);

    await expect(
      cartPage.getCartItem(testProduct.id)
    ).toBeVisible();

    // 4. Proceed to checkout
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/\/checkout/);

    // 5. Fill customer information
    await checkoutPage.fillCustomerInfo(
      checkoutData.customerName,
      checkoutData.customerEmail
    );

    // 6. Fill shipping address
    await checkoutPage.fillShippingAddress(
      checkoutData.shippingAddress
    );

    // 7. Select payment method
    await checkoutPage.selectPaymentMethod(
      checkoutData.paymentMethod
    );

    // 8. Verify payment selection
    await expect(
      page.getByTestId(
        `payment-method-${checkoutData.paymentMethod}`
      )
    ).toBeChecked();

    // 9. Verify required form fields
    const formIsValid = await page
      .locator("form")
      .evaluate((element) => {
        return (
          element as HTMLFormElement
        ).checkValidity();
      });

    expect(formIsValid).toBe(true);

    // 10. Confirm purchase
    await checkoutPage.confirmPurchase();

    // 11. Verify confirmation URL
    await expect(page).toHaveURL(/\/confirmation/);

    // 12. Verify confirmation message
    await expect(
      confirmationPage.confirmationMessage
    ).toBeVisible();

    // 13. Verify order was saved
    const savedOrder = await page.evaluate(() => {
      const order = localStorage.getItem(
        "shopzone_last_order"
      );

      return order ? JSON.parse(order) : null;
    });

    expect(savedOrder).not.toBeNull();

    expect(savedOrder).toMatchObject({
      customerName: checkoutData.customerName,
      customerEmail: checkoutData.customerEmail,
      shippingAddress: checkoutData.shippingAddress,
      paymentMethod: checkoutData.paymentMethod,
    });

    expect(savedOrder.orderId).toBeTruthy();
    expect(savedOrder.total).toBeGreaterThan(0);
    expect(savedOrder.items).toHaveLength(1);
  });

  /**
   * TEST CASE 2:
   * Prevent checkout with an empty cart.
   */
  test("should display an error when checking out with an empty cart", async ({
    page,
  }) => {
    const {
      loginPage,
      cartPage,
    } = createPages(page);

    // 1. Login
    await loginAsTestUser(loginPage);

    // 2. Open empty cart
    await cartPage.goto();

    await expect(page).toHaveURL(/\/cart/);

    // 3. Attempt checkout
    await cartPage.proceedToCheckout();

    // 4. Support both old and new React test IDs
    const emptyCartMessage = page
      .locator(
        '[data-testid="empty-cart-message"], ' +
        '[data-testid="cart-empty-message"]'
      )
      .first();

    await expect(
      emptyCartMessage
    ).toBeVisible();

    // 5. Verify user remains on cart page
    await expect(page).toHaveURL(/\/cart/);
  });

  /**
   * TEST CASE 3:
   * Preserve cart contents after session expiry and re-login.
   */
  test("should preserve cart contents after session expiry and re-login", async ({
    page,
  }) => {
    const {
      loginPage,
      productsPage,
      cartPage,
      checkoutPage,
    } = createPages(page);

    // 1. Login
    await loginAsTestUser(loginPage);

    // 2. Add product to cart
    await productsPage.addProductToCart(
      testProduct.id
    );

    // 3. Navigate to cart
    await cartPage.goto();

    await expect(
      cartPage.getCartItem(testProduct.id)
    ).toBeVisible();

    // 4. Simulate session expiry.
    // Clear cookies only; preserve cart in localStorage.
    await page.context().clearCookies();

    // 5. Attempt to access protected checkout
    await checkoutPage.goto();

    // 6. Verify redirect to login
    await expect(page).toHaveURL(/\/login/);

    // 7. Login again
    await loginPage.login(
      testUser.email,
      testUser.password
    );

    await expect(page).toHaveURL(/\/products/);

    // 8. Verify cart contents are preserved
    await cartPage.goto();

    await expect(
      cartPage.getCartItem(testProduct.id)
    ).toBeVisible();
  });

});
