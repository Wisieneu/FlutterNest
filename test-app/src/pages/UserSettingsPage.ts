import { expect, Locator, Page } from "@playwright/test";

import { AbstractPage } from "./AbstractPage";

export class UserSettingsPage extends AbstractPage {
  private userMetadataChangeForm: Locator;

  constructor(page: Page) {
    super(page);
    this.userMetadataChangeForm = this.getElementByTestId(
      "user-metadata-change-form"
    );
  }

  async navigateTo(): Promise<void> {
    await this.page.goto("/settings");
    await this.page.waitForSelector("text=User metadata");
  }

  async openUserMetadataForm(): Promise<void> {
    this.userMetadataChangeForm.click();
    await this.page.waitForSelector("text=User metadata");
  }
}
