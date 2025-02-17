import { test as base, Page } from "playwright/test";
import playwrightObject from "./playwright.object";
import { UserSettingsPage } from "@/page-objects/user.settings.page";
import { quickApiLogin, setAuthCookie } from "@/utils/auth";

type TestRunnerFixtures = {
  unauthenticatedPage: Page;
  userSettingsPage: UserSettingsPage;
};

export const test = base.extend<TestRunnerFixtures>({
  unauthenticatedPage: async ({ browser, browserName }, use) => {
    await playwrightObject.initNew({
      playwrightBrowser: browser,
      browserName,
    });
    await use(playwrightObject.page());
    await playwrightObject.close();
  },
  userSettingsPage: async ({ browser, browserName, request }, use) => {
    await playwrightObject.initNew({
      playwrightBrowser: browser,
      browserName,
    });
    const context = playwrightObject.context;
    const token = await quickApiLogin(request);
    setAuthCookie(context, token);
    await use(new UserSettingsPage());
    await playwrightObject.close();
  },
});
