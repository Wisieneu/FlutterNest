import { test, expect } from "@playwright/test";

import { SignInPage } from "@pages/SignInPage";

import * as dotenv from "dotenv";

dotenv.config();

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
  const { userLogin, userPassword } = process.env;

  test.beforeEach(async ({ page }) => {
    signInPage = new SignInPage(page);
    await signInPage.navigateTo();
  });

  test("Sign in - positive scenario", async ({ page }) => {
    await signInPage.navigateTo();
    await signInPage.inputCredentials(userLogin, userPassword);

    const [response] = await Promise.all([
      page.waitForResponse((response) =>
        response.url().includes("api/v1/users/signin")
      ),
      signInPage.clickSignInButton(),
    ]);
    await expect(signInPage.toastElement).toHaveText(/Signing in/, {
      timeout: 5000,
    });
    expect(response.status()).toBe(200);
    await expect(signInPage.toastElement).toHaveText(/Logged in/, {
      timeout: 5000,
    });
  });

  test("Login - wrong credentials", async ({ page }) => {
    signInPage = new SignInPage(page);
    await signInPage.navigateTo();
    await signInPage.inputCredentials(process.env.userLogin, "wrongPassword");
  });
});
