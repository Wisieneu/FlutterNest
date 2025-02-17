import { AbstractElement } from "./abstract.element";

export class TextElement extends AbstractElement {
  public text: string;

  constructor(selector: string, text: string) {
    super(selector);
    this.text = text;
  }
}
