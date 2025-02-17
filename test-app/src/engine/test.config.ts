import { FullConfig, selectors } from "playwright/test";
import { Languages } from "./translations/languages";
import { getTranslations, Translation } from "./translations/translation";

const language: Languages = Languages.ENGLISH;

export class Config {
  private static instance: Config;

  shouldLogData: boolean = process.env.LOG_DATA
    ? getEnvVariableAsBoolean(process.env.LOG_DATA)
    : false;
  appUrl = process.env.baseUrl;
  apiUrl = process.env.baseApiUrl;
  language: Languages = language;
  translations: Translation = getTranslations(language);

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
      this.logData();
    }
    return Config.instance;
  }

  public static logData() {
    if (Config.instance.shouldLogData) {
      console.log(`Initialized application tests:`);
      console.log(`    1. With url: ${Config.instance.appUrl}`);
      console.log(`    2. With language: ${Config.instance.language}`);
    }
  }
}

export const getEnvVariableAsBoolean = (
  variable: string | undefined
): boolean => variable === "true";

async function globalSetup(config: FullConfig) {
  getConfig();
  selectors.setTestIdAttribute("data-test-id");
}

export default globalSetup;

export const getConfig = (): Config => {
  return Config.getInstance();
};
