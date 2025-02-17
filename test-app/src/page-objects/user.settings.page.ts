import { expect, Page } from "@playwright/test";

import { AbstractPage } from "./abstract.page";
import { InputElement } from "@/elements/input.element";
import { getTestIdLocator } from "@/elements/abstract.element";
import { ButtonElement } from "@/elements/button.element";
import { FormElement } from "@/elements/form.element";
import playwrightObject from "@/engine/playwright.object";

export class UserSettingsPage extends AbstractPage {
  url = "/settings";

  metadataChangeForm: {
    container: FormElement;
    usernameInput: InputElement;
    displayNameInput: InputElement;
    locationInput: InputElement;
    websiteInput: InputElement;
    bioInput: InputElement;
    submitBtn: ButtonElement;
  };

  pfpChangeForm: {
    container: FormElement;
    fileUploadBtn: ButtonElement; // TODO: change to FileUploadElement
    submitBtn: ButtonElement;
  };

  passwordChangeForm: {
    container: FormElement;
    expandBtn: ButtonElement;
    currentPasswordInput: InputElement;
    newPasswordInput: InputElement;
    newPasswordConfirmInput: InputElement;
    submitBtn: ButtonElement;
  };

  constructor(url: string = "/settings", tabName = "") {
    super(tabName, url);
    this.metadataChangeForm = {
      container: new FormElement(getTestIdLocator("user-metadata-change-form")),
      usernameInput: new InputElement(getTestIdLocator("username-input")),
      displayNameInput: new InputElement(
        getTestIdLocator("display-name-input")
      ),
      locationInput: new InputElement(getTestIdLocator("location-input")),
      websiteInput: new InputElement(getTestIdLocator("website-input")),
      bioInput: new InputElement(getTestIdLocator("bio-input")),
      submitBtn: new ButtonElement(
        getTestIdLocator("metadata-form-submit-button")
      ),
    };

    // Profile picture change form
    this.pfpChangeForm = {
      container: new FormElement(
        getTestIdLocator("profile-picture-change-form")
      ),
      fileUploadBtn: new ButtonElement( // TODO: change to FileInputElement
        getTestIdLocator("profile-picture-upload-button")
      ),
      submitBtn: new ButtonElement(
        getTestIdLocator("profile-picture-form-submit-button")
      ),
    };

    // Password change form
    this.passwordChangeForm = {
      container: new FormElement(getTestIdLocator("pw-change-form")),
      expandBtn: new ButtonElement(
        getTestIdLocator("pw-change-form__open-btn")
      ),
      currentPasswordInput: new InputElement(
        getTestIdLocator("pw-change-current-pw-input")
      ),
      newPasswordInput: new InputElement(
        getTestIdLocator("pw-change-form-input")
      ),
      newPasswordConfirmInput: new InputElement(
        getTestIdLocator("pw-change-form-confirm-input")
      ),
      submitBtn: new ButtonElement(
        getTestIdLocator("pw-change-form-submit-button")
      ),
    };
  }

  async open(wait = true): Promise<void> {
    await playwrightObject.open(this.url);
    if (wait) await this.waitForLoadState("networkidle");
    await this.shouldBeOpened();
  }

  async openMetadataChangeForm(): Promise<void> {
    await this.metadataChangeForm.container.click();
    await this.metadataChangeForm.usernameInput.toBeVisible();
    await this.metadataChangeForm.usernameInput.toBeDisabled();
    await this.metadataChangeForm.displayNameInput.toBeVisible();
    await this.metadataChangeForm.locationInput.toBeVisible();
    await this.metadataChangeForm.websiteInput.toBeVisible();
    await this.metadataChangeForm.bioInput.toBeVisible();
    await this.metadataChangeForm.submitBtn.toBeVisible();
  }

  async openProfilePictureForm(): Promise<void> {
    await this.pfpChangeForm.container.click();
    await this.pfpChangeForm.fileUploadBtn.toBeVisible();
    await this.pfpChangeForm.submitBtn.toBeVisible();
    await this.pfpChangeForm.submitBtn.toBeDisabled();
  }

  async openPasswordChangeForm(): Promise<void> {
    await this.passwordChangeForm.expandBtn.click();
    await this.passwordChangeForm.container.toBeVisible();
    await this.passwordChangeForm.newPasswordInput.toBeVisible();
    await this.passwordChangeForm.currentPasswordInput.toBeVisible();
    await this.passwordChangeForm.newPasswordConfirmInput.toBeVisible();
    await this.passwordChangeForm.submitBtn.toBeVisible();
    await this.passwordChangeForm.submitBtn.toBeDisabled();
  }
}
