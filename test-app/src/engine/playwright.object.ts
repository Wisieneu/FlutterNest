import { Browser, BrowserContext, Page } from "playwright";

interface Initialization {
  playwrightBrowser?: Browser;
  browserContext?: BrowserContext;
  page?: Page;
  browserName?: string;
}

class PlaywrightObject {
  browser?: Browser;
  context?: BrowserContext;
  browserName?: string;
  private playwrightPage?: Page;

  async init(init: Initialization) {
    if (this.browser) return;
    this.browser = init.playwrightBrowser;
    this.context = init.browserContext;
    this.playwrightPage = init.page;
  }

  async initNew(init: Initialization) {
    if (!init.playwrightBrowser) {
      throw new Error("Cannot start without a browser.");
    }
    this.browser = init.playwrightBrowser;
    this.browserName = init.browserName;
    this.context = await this.browser.newContext();
    this.context.addCookies([
      {
        name: "automation-tests",
        value: "true",
        domain: "localhost",
        path: "/",
      },
    ]);
    this.playwrightPage = await this.context.newPage();
  }

  async close() {
    await this.browser.close();
    this.browser = undefined;
  }

  async initAll(init: Initialization) {
    if (!init.playwrightBrowser) {
      throw new Error("Cannot start without a browser.");
    }
    if (this.browser) return;
    this.browser = init.playwrightBrowser;
    this.context = await this.browser.newContext();
    this.playwrightPage = await this.context.newPage();
  }

  async open(url: string): Promise<void> {
    if (!this.page) {
      throw new Error("Cannot open page without a context.");
    }
    await this.page().goto(url);
  }

  page(): Page {
    if (!this.playwrightPage) {
      throw new Error("No page available.");
    }
    return this.playwrightPage;
  }
}

export default new PlaywrightObject();
