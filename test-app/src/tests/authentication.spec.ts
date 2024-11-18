import { test, expect } from "@playwright/test";

import { SignInPage } from "../pages/SignInPage";

import configuration from "../../configuration.json";

test("Auth page opening, dynamic URLs", { tag: "@smoke" }, async ({ page }) => {
  const signInForm = page.locator("#sign-in-form");
  const signUpForm = page.locator("#sign-up-form");

  await page.goto("/auth");
  await expect(signUpForm).toBeVisible();
  await expect(signInForm).not.toBeVisible();

  await page.goto("/auth/signin");
  await expect(signInForm).toBeVisible();

  await page.goto("/auth/signup");
  await expect(signUpForm).toBeVisible();
});

test.describe("Sign In e2e", () => {
  let signInPage: SignInPage;

  test.beforeEach(async ({ page }) => {
    signInPage = new SignInPage(page);
    await signInPage.navigateTo();
  });

  test.only("Sign in - positive scenario", async ({ page }) => {
    await signInPage.navigateTo();
    await signInPage.inputCredentials(
      configuration.userLogin,
      configuration.userPassword
    );

    const [response] = await Promise.all([
      page.waitForResponse((response) =>
        response.url().includes("api/v1/users/signin")
      ),
      signInPage.clickSignInButton(),
    ]);
    const toastMessageInitial = await signInPage.getToastMessage();
    expect(toastMessageInitial).toContain("Signing in");
    expect(response.status()).toBe(200);
    await expect(signInPage.toastElement).toHaveText(/Logged in/, {
      timeout: 5000,
    });
  });

  test("Login - wrong credentials", async ({ page }) => {});
});
