
import { type Locator, type Page } from "@playwright/test";

export class CartPage {
  readonly emptyCartMessage: Locator;

constructor(private readonly page: Page) {
  this.emptyCartMessage = page.locator(
    '[data-testid="empty-cart-message"], ' +
    '[data-testid="cart-empty-message"]'
  );
}

  async goto(): Promise<void> {
    await this.page.goto("/cart");
  }

  getCartItem(productId: string): Locator {
    return this.page.getByTestId(
      `cart-item-${productId}`
    );
  }

  async proceedToCheckout(): Promise<void> {
    await this.page
      .getByTestId("checkout-button")
      .click();
  }
}
