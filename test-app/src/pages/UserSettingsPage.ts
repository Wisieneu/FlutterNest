import { expect, Locator, Page } from "@playwright/test";

import { AbstractPage } from "./AbstractPage";

export class UserSettingsPage extends AbstractPage {
  // Metadata change form
  metadataChangeForm: Locator;
  metadataUsernameInput: Locator;
  metadataDisplayNameInput: Locator;
  metadataLocationInput: Locator;
  metadataWebsiteInput: Locator;
  metadataBioInput: Locator;
  metadataFormSubmitBtn: Locator;

  // Profile picture change form
  pfpChangeForm: Locator;
  pfpFormFileUploadBtn: Locator;
  pfpFormSubmitBtn: Locator;

  // Password change form
  pwChangeForm: Locator;
  pwChangeFormExpandBtn: Locator;
  pwChangeFormCurrentPasswordInput: Locator;
  pwChangeFormInput: Locator;
  pwChangeFormConfirmInput: Locator;
  pwChangeFormSubmitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.metadataChangeForm = this.testIdLocator("user-metadata-change-form");
    this.metadataUsernameInput = this.testIdLocator("username-input");
    this.metadataDisplayNameInput = this.testIdLocator("display-name-input");
    this.metadataLocationInput = this.testIdLocator("location-input");
    this.metadataWebsiteInput = this.testIdLocator("website-input");
    this.metadataBioInput = this.testIdLocator("bio-input");
    this.metadataFormSubmitBtn = this.testIdLocator(
      "metadata-form-submit-button"
    );

    // Profile picture change form
    this.pfpChangeForm = this.testIdLocator("profile-picture-change-form");
    this.pfpFormFileUploadBtn = this.testIdLocator(
      "profile-picture-upload-button"
    );
    this.pfpFormSubmitBtn = this.testIdLocator(
      "profile-picture-form-submit-button"
    );

    // Password change form
    this.pwChangeForm = this.testIdLocator("pw-change-form");
    this.pwChangeFormExpandBtn = this.testIdLocator("pw-change-form__open-btn");
    this.pwChangeFormCurrentPasswordInput = this.testIdLocator(
      "pw-change-current-pw-input"
    );
    this.pwChangeFormInput = this.testIdLocator("pw-change-form-input");
    this.pwChangeFormConfirmInput = this.testIdLocator(
      "pw-change-form-confirm-input"
    );
    this.pwChangeFormSubmitBtn = this.testIdLocator(
      "pw-change-form-submit-button"
    );
  }

  async navigateTo(): Promise<void> {
    await this.page.goto("/settings");
  }

  async openUserMetadataForm(): Promise<void> {
    this.metadataChangeForm.click();
    await expect(this.metadataUsernameInput).toBeVisible();
    await expect(this.metadataUsernameInput).toBeDisabled();
    await expect(this.metadataDisplayNameInput).toBeVisible();
    await expect(this.metadataLocationInput).toBeVisible();
    await expect(this.metadataWebsiteInput).toBeVisible();
    await expect(this.metadataBioInput).toBeVisible();
    await expect(this.metadataFormSubmitBtn).toBeVisible();
  }

  async openProfilePictureForm(): Promise<void> {
    this.pfpChangeForm.click();
    await expect(this.pfpFormFileUploadBtn).toBeVisible();
    await expect(this.pfpFormSubmitBtn).toBeVisible();
    await expect(this.pfpFormSubmitBtn).toBeDisabled();
  }

  async openPasswordChangeForm(): Promise<void> {
    this.pwChangeFormExpandBtn.click();
    await expect(this.pwChangeForm).toBeVisible();
    await expect(this.pwChangeFormInput).toBeVisible();
    await expect(this.pwChangeFormCurrentPasswordInput).toBeVisible();
    await expect(this.pwChangeFormConfirmInput).toBeVisible();
    await expect(this.pwChangeFormSubmitBtn).toBeVisible();
    await expect(this.pwChangeFormSubmitBtn).toBeDisabled();
  }
}
