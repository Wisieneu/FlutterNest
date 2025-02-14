import { AbstractPage } from "./abstract.page";

export class MainPage extends AbstractPage {
  constructor() {
    super("FlutterNest", "/", ".page-wrapper");
  }
}
