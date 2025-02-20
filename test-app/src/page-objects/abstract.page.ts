import { expect } from "@playwright/test";

import playwrightObject from "@/engine/playwright.object";

import { DivElement } from "@/elements/div.element";
import { DynamicTextElement } from "@/elements/dynamic.text.element";

export abstract class AbstractPage {
  protected tabName: string;
  protected partialUrl: string;
  protected pageSelector: string = ".page-wrapper";

  toastElement: {
    container: DivElement;
    text: DynamicTextElement;
  };

  constructor(tabName?: string, partialUrl?: string, pageSelector?: string) {
    this.tabName = tabName;
    this.partialUrl = partialUrl;
    this.pageSelector = pageSelector;
    this.initializeCommonElements();
  }

  async openPage() {
    await playwrightObject.open(this.partialUrl);
  }

  async openUrl(url: string) {
    await playwrightObject.open(url);
  }

  async reloadPage() {
    await playwrightObject.page().reload();
  }

  async shouldBeOpened() {
    await this.waitForLoadState("networkidle");
    await this.waitForLoadState("domcontentloaded");
    if (this.pageSelector) {
      await this.waitForPageSelector();
    }
    if (this.partialUrl) {
      await this.validateUrl();
    }
    if (this.tabName) {
      await this.validateTabName();
    }
  }

  async waitforUrl(url: string) {
    await playwrightObject.page().waitForURL(url);
  }

  async waitForLoadState(
    state: "load" | "domcontentloaded" | "networkidle",
    options?: { timeout?: number }
  ) {
    await playwrightObject.page().waitForLoadState(state, options);
  }

  /**
   * Checks whether the page selector is available on the page
   * Page selector could be ".page-wrapper" which contains the whole page
   */
  async waitForPageSelector() {
    if (!this.waitForPageSelector()) return;
    await playwrightObject.page().waitForSelector(this.pageSelector);
  }

  async validateUrl() {
    await playwrightObject.page().waitForURL(this.partialUrl);
  }

  async validateTabName() {
    if (!this.tabName) {
      throw new Error("Tab name not specified");
    }
    const actualTitle = await playwrightObject.page().title();
    expect(actualTitle).toEqual(this.tabName);
  }

  initializeCommonElements() {
    this.toastElement = {
      container: new DivElement(".Toastify__toast-container"),
      text: new DynamicTextElement(".Toastify__toast-body"),
    };
  }
}
