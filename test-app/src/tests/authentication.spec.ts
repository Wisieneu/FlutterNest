import { test, expect } from "@playwright/test";
import { SignInPage } from "../pages/SignInPage";

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

  test("Sign in - positive scenario", { tag: "@smoke" }, async ({ page }) => {
    await signInPage.navigateTo();
    await signInPage.inputCredentials("test", "test");
    await signInPage.clickSignInButton();
    const toastMessage = await signInPage.getToastMessage();
    expect(toastMessage).toBe("Authentication failed");
  });

  test("Login - wrong credentials", async ({ page }) => {});
});
