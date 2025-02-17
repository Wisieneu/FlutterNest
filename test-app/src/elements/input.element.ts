import { AbstractElement } from "./abstract.element";

export class InputElement extends AbstractElement {
  constructor(selector: string) {
    super(selector);
  }

  type(text: string) {
    return this.element().fill(text);
  }
}
