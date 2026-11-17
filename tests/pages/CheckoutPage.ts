
import { expect, type Page } from "@playwright/test";

export type PaymentMethod = "card" | "cash";

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  /**
   * Navigate to checkout.
   */
  async goto(): Promise<void> {
    await this.page.goto("/checkout");
  }

  /**
   * Fill customer name and email.
   */
  async fillCustomerInfo(
    name: string,
    email: string
  ): Promise<void> {
    const nameInput = this.page.getByTestId("customer-name");
    const emailInput = this.page.getByTestId("customer-email");

    await expect(nameInput).toBeVisible();
    await nameInput.fill(name);

    await expect(emailInput).toBeVisible();
    await emailInput.fill(email);
  }

  /**
   * Fill shipping address.
   */
  async fillShippingAddress(
    address: string
  ): Promise<void> {
    const addressInput = this.page.getByTestId(
      "shipping-address"
    );

    await expect(addressInput).toBeVisible();
    await addressInput.fill(address);
  }

  /**
   * Select Card or Cash on Delivery.
   */
  async selectPaymentMethod(
    method: PaymentMethod
  ): Promise<void> {
    const paymentOption = this.page.getByTestId(
      `payment-method-${method}`
    );

    await expect(paymentOption).toBeVisible();
    await paymentOption.check();

    await expect(paymentOption).toBeChecked();
  }

  /**
   * Verify the selected payment method.
   */
  async verifyPaymentMethod(
    method: PaymentMethod
  ): Promise<void> {
    await expect(
      this.page.getByTestId(`payment-method-${method}`)
    ).toBeChecked();
  }

  /**
   * Confirm the purchase.
   */
  async confirmPurchase(): Promise<void> {
    const confirmButton = this.page.getByTestId(
      "confirm-purchase-button"
    );

    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toBeEnabled();

    await confirmButton.click();
  }

  /**
   * Verify successful order confirmation.
   */
  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.page).toHaveURL(/\/confirmation/);

    await expect(
      this.page.getByTestId("order-confirmation-message")
    ).toBeVisible();
  }
}
