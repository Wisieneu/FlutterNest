import { AbstractElement } from "./abstract.element";

export class InputElement extends AbstractElement {
  constructor(selector: string) {
    super(selector);
  }

  fill(text: string): Promise<void> {
    return this.element().fill(text);
  }
}
