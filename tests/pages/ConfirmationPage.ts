
import { type Locator, type Page } from "@playwright/test";

export class ConfirmationPage {
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    this.confirmationMessage = page.getByTestId(
      "order-confirmation-message"
    );
  }
}
