import { expect } from "playwright/test";
import { AbstractElement } from "./abstract.element";

export class InputElement extends AbstractElement {
  constructor(selector: string) {
    super(selector);
  }

  fill(text: string): Promise<void> {
    return this.element().fill(text);
  }

  async getInnerValue() {
    return await this.element().inputValue();
  }

  async verifyInputValue(text: string, options?: { timeout?: number }) {
    await expect(this.element()).toHaveValue(text, options);
  }
}
