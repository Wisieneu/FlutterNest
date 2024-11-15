import { test, expect } from "@playwright/test";

import locators from "./constants";

const signInPageLocators = locators.signInPage;

test.describe("Login", () => {
  /**
   * Tests the auth page opening, and dynamic URLs
   * /auth opens the auth page, with the sign up form visible by default
   * /auth/signin opens the sign in form
   * /auth/signup opens the sign up form
   */
  test(
    "Auth page opening, dynamic URLs",
    { tag: "@smoke" },
    async ({ page }) => {
      const signInForm = page.locator("#sign-in-form");
      const signUpForm = page.locator("#sign-up-form");

      await page.goto("/auth");
      await expect(signUpForm).toBeVisible();

      await page.goto("/auth/signin");
      await expect(signInForm).toBeVisible();

      await page.goto("/auth/signup");
      await expect(signUpForm).toBeVisible();
    },
  );

  test("Login - positive scenario", { tag: "@smoke" }, async ({ page }) => {
    await page.goto("/auth/signin");
    const loginInput = page.locator(signInPageLocators.loginInput);
    const passwordInput = page.locator(signInPageLocators.passwordInput);
    const loginSubmitButton = page.locator(signInPageLocators.submitButton);
    const loginInputText = "test";
    const passwordInputText = "test";

    await loginInput.fill(loginInputText);
    await passwordInput.fill(passwordInputText);
    expect(await loginInput.inputValue()).toBe(loginInputText);
    await loginSubmitButton.click();

    const toastElement = page.locator(signInPageLocators.toastElement);
    await expect(toastElement).toContainText("Authentication failed");
  });

  test("Login - wrong credentials", async ({ page }) => {
    const loginInput = page.locator(signInPageLocators.loginInput);
    const passwordInput = page.locator(signInPageLocators.passwordInput);
    const loginSubmitButton = page.locator(signInPageLocators.submitButton);

    const loginInputText = "testuser3213123@company.com";
  });
});
