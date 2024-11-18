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
  metadataFormSubmitButton: Locator;

  // Profile picture change form
  profilePictureChangeForm: Locator;
  profilePictureFormFileUploadButton: Locator;
  profilePictureFormSubmitButton: Locator;

  // Password change form
  passwordChangeForm: Locator;
  passwordChangeCurrentPasswordInput: Locator;
  passwordChangeFormInput: Locator;
  passwordChangeFormConfirmInput: Locator;
  passwordChangeFormSubmitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.metadataChangeForm = this.getElementByTestId(
      "user-metadata-change-form"
    );
    this.metadataUsernameInput = this.getElementByTestId("username-input");
    this.metadataDisplayNameInput =
      this.getElementByTestId("display-name-input");
    this.metadataLocationInput = this.getElementByTestId("location-input");
    this.metadataWebsiteInput = this.getElementByTestId("website-input");
    this.metadataBioInput = this.getElementByTestId("bio-input");
    this.metadataFormSubmitButton = this.getElementByTestId(
      "metadata-form-submit-button"
    );

    this.profilePictureChangeForm = this.getElementByTestId(
      "profile-picture-change-form"
    );
    this.profilePictureFormFileUploadButton = this.getElementByTestId(
      "profile-picture-upload-button"
    );
    this.profilePictureFormSubmitButton = this.getElementByTestId(
      "profile-picture-form-submit-button"
    );

    this.passwordChangeForm = this.getElementByTestId("password-change-form");
    this.passwordChangeCurrentPasswordInput = this.getElementByTestId(
      "current-password-input"
    );
    this.passwordChangeFormInput = this.getElementByTestId(
      "password-change-form-input"
    );
    this.passwordChangeFormConfirmInput = this.getElementByTestId(
      "password-change-form-confirm-input"
    );
    this.passwordChangeFormSubmitButton = this.getElementByTestId(
      "password-change-form-submit-button"
    );
  }

  async navigateTo(): Promise<void> {
    await this.page.goto("/settings");
    await this.metadataChangeForm.waitFor();
  }

  async openUserMetadataForm(): Promise<void> {
    this.metadataChangeForm.click();
    await expect(this.metadataUsernameInput).toBeVisible();
    await expect(this.metadataUsernameInput).toBeDisabled();
    await expect(this.metadataDisplayNameInput).toBeVisible();
    await expect(this.metadataLocationInput).toBeVisible();
    await expect(this.metadataWebsiteInput).toBeVisible();
    await expect(this.metadataBioInput).toBeVisible();
    await expect(this.metadataFormSubmitButton).toBeVisible();
  }

  async openProfilePictureForm(): Promise<void> {
    this.profilePictureChangeForm.click();
    await expect(this.profilePictureFormFileUploadButton).toBeVisible();
    await expect(this.profilePictureFormSubmitButton).toBeVisible();
    await expect(this.profilePictureFormSubmitButton).toBeDisabled();
  }

  async openPasswordChangeForm(): Promise<void> {
    this.passwordChangeForm.click();
    await expect(this.passwordChangeFormInput).toBeVisible();
    await expect(this.passwordChangeCurrentPasswordInput).toBeVisible();
    await expect(this.passwordChangeFormConfirmInput).toBeVisible();
    await expect(this.passwordChangeFormSubmitButton).toBeVisible();
    await expect(this.passwordChangeFormSubmitButton).toBeDisabled();
  }
}
