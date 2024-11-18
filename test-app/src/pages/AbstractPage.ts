import { Locator, Page } from "@playwright/test";

export abstract class AbstractPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
    this.page.context().addCookies([
      {
        name: "automation-tests",
        value: "true",
      },
    ]);
  }

  public getElementByTestId(testId: string): Locator {
    return this.page.locator(`[data-test-id=${testId}]`);
  }
}
