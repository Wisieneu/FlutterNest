import { AbstractElement } from "./abstract.element";

/**
 * Differs from TextElement in that it doesn't have a static text property
 * Can be checked for having a specific text value at any time with any value
 */
export class DynamicTextElement extends AbstractElement {
  constructor(selector: string) {
    super(selector);
  }

  async validateText(text: string) {
    await this.toHaveText(text);
  }
}
