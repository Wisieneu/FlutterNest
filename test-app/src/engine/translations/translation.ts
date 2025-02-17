import { enTranslation } from "./en/en.translation";
import { jpTranslation } from "./jp/jp.translation";
import { Languages } from "./languages";

export interface Translation {
  signUpPageTranslation: SignUpPageTranslation;
  signInPageTranslation: SignInPageTranslation;
}

export interface SignUpPageTranslation {
  exampleText: string;
}

export interface SignInPageTranslation {
  examplaryText: string;
}

export const getTranslations = (language: Languages): Translation => {
  let languageMap = new Map([
    [Languages.ENGLISH, enTranslation],
    [Languages.JAPANESE, jpTranslation],
  ]);

  let translation = languageMap.get(language);
  if (translation) {
    return translation;
  } else {
    return enTranslation;
  }
};
