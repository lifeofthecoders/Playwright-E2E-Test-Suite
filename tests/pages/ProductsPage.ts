
import { type Page } from "@playwright/test";

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async addProductToCart(productId: string): Promise<void> {
    await this.page
      .getByTestId(`add-to-cart-${productId}`)
      .click();
  }

  async goToCart(): Promise<void> {
    await this.page
      .getByTestId("cart-link")
      .click();
  }
}
