import { Locator } from "playwright";
import { expect } from "playwright/test";

import playwrightObject from "@/engine/playwright.object";

export abstract class AbstractElement {
  constructor(public selector: string) {}

  element(): Locator {
    return playwrightObject.page().locator(this.selector);
  }

  public async toBeVisible() {
    await this.element().waitFor({ state: "visible" });
  }

  public async toBeHidden() {
    await this.element().waitFor({ state: "hidden" });
  }

  public async toBeEnabled() {
    await expect(this.element()).toBeEnabled();
  }

  public async toBeDisabled() {
    await expect(this.element()).toBeDisabled();
  }

  public async toHaveText(text: string) {
    await expect(this.element()).toHaveText(text);
  }

  public async click() {
    return await this.element().click();
  }

  public async doubleClick() {
    return await this.element().dblclick();
  }

  public async press(key: string) {
    return await this.element().press(key);
  }
}

export const getTestIdLocator = (testId: string): string =>
  `[data-test-id=${testId}]`;
