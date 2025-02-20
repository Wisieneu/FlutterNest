import { test as base, Page } from "playwright/test";

import { UserSettingsPage } from "@/page-objects/user.settings.page";
import { MainPage } from "@/page-objects/main.page";

import playwrightObject from "./playwright.object";
import { quickApiLogin, setAuthCookie } from "@/utils/auth";

type TestRunnerFixtures = {
  unauthenticatedPage: Page;
  authenticatedPage: Page;
  userSettingsPage: UserSettingsPage;
  mainPage: MainPage;
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

  authenticatedPage: async ({ browser, browserName, request }, use) => {
    await playwrightObject.initNew({
      playwrightBrowser: browser,
      browserName,
    });
    const context = playwrightObject.context;
    const token = await quickApiLogin(request);
    setAuthCookie(token);
    await use(playwrightObject.page());
    await playwrightObject.close();
  },

  mainPage: async ({ browser, browserName, request }, use) => {
    await playwrightObject.initNew({
      playwrightBrowser: browser,
      browserName,
    });
    const context = playwrightObject.context;
    const token = await quickApiLogin(request);
    setAuthCookie(token);
    await use(new MainPage());
    await playwrightObject.close();
  },

  userSettingsPage: async ({ browser, browserName, request }, use) => {
    await playwrightObject.initNew({
      playwrightBrowser: browser,
      browserName,
    });
    const context = playwrightObject.context;
    const token = await quickApiLogin(request);
    setAuthCookie(token);
    await use(new UserSettingsPage());
    await playwrightObject.close();
  },
});
