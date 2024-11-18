import { expect, Locator, Page } from "@playwright/test";
import { AbstractPage } from "./AbstractPage";

export class SignInPage extends AbstractPage {
  private loginField: Locator;
  private passwordField: Locator;
  private signInSubmitButton: Locator;
  private toastElement: Locator;
  private signInForm: Locator;

  constructor(page: Page) {
    super(page);
    this.loginField = page.locator("[name=login]");
    this.passwordField = page.locator("[name=password]");
    this.signInSubmitButton = page.locator("[type=submit]");
    this.toastElement = page.locator(".Toastify__toast");
    this.signInForm = page.locator("#sign-in-form");
  }

  async navigateTo(): Promise<void> {
    await this.page.goto("/auth/signin");
  }

  async inputCredentials(username: string, password: string): Promise<void> {
    await this.loginField.fill(username);
    await this.passwordField.fill(password);
  }

  async clickSignInButton(): Promise<void> {
    await this.signInSubmitButton.click();
  }

  async getToastMessage(): Promise<string> {
    return await this.toastElement.innerText();
  }
}
