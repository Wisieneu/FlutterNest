import test, { expect } from "@playwright/test";
import { quickApiLogin, setAuthCookie } from "../utils/auth";
import { UserSettingsPage } from "../pages/UserSettingsPage";
import { cleanupTestUserData } from "@/utils/teardown";

test.describe("E2E user settings page", () => {
  let token: string;
  let userSettingsPage: UserSettingsPage;

  test.beforeAll(async ({ request }) => {
    token = await quickApiLogin(request);
  });

  test.beforeEach(async ({ page }) => {
    await setAuthCookie(page, token);
  });

  test("Page loads when logged in", async ({ page }) => {
    userSettingsPage = new UserSettingsPage(page);
    await userSettingsPage.navigateTo();
  });

  test("Page doesn't load when not logged in", async ({ page }) => {
    userSettingsPage = new UserSettingsPage(page);
    page.context().clearCookies(); // logs the user out
    await userSettingsPage.navigateTo();
    expect(page.url()).not.toContain("/settings");
  });

  test("User metadata form is expanded when clicked", async ({ page }) => {
    userSettingsPage = new UserSettingsPage(page);
    await userSettingsPage.navigateTo();
    await userSettingsPage.openUserMetadataForm();
  });

  test("Profile picture form is expanded when clicked", async ({ page }) => {
    userSettingsPage = new UserSettingsPage(page);
    await userSettingsPage.navigateTo();
    await userSettingsPage.openProfilePictureForm();
  });

  test("Password change form is expanded when clicked", async ({ page }) => {
    userSettingsPage = new UserSettingsPage(page);
    await userSettingsPage.navigateTo();
    await userSettingsPage.openPasswordChangeForm();
  });

  test.afterEach(async ({ request }) => {
    cleanupTestUserData(request);
  });
});
