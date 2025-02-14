import { expect, Locator, Page } from "@playwright/test";
import { AbstractPage } from "./abstract.page";

export class SignInPage extends AbstractPage {
  loginField: Locator;
  passwordField: Locator;
  signInSubmitButton: Locator;
  toastElement: Locator;
  signInForm: Locator;

  constructor(page: Page) {
    super();
    this.loginField = page.locator("[name=login]");
    this.passwordField = page.locator("[name=password]");
    this.signInSubmitButton = page.locator("[type=submit]");
    this.toastElement = page.locator(".Toastify__toast");
    this.signInForm = page.locator("#sign-in-form");
  }

  async navigateTo(): Promise<void> {
    // await this.page.goto("/auth/signin");
  }

  async inputCredentials(login: string, password: string): Promise<void> {
    await this.loginField.fill(login);
    await this.passwordField.fill(password);
  }

  async clickSignInButton(): Promise<void> {
    await this.signInSubmitButton.click();
  }

  async getToastMessage(): Promise<string> {
    return await this.toastElement.innerText();
  }
}
