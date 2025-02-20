import playwrightObject from "@/engine/playwright.object";
import { APIRequestContext, BrowserContext } from "@playwright/test";

const { userLogin, userPassword, baseApiUrl } = process.env;

export async function quickApiLogin(
  request: APIRequestContext
): Promise<string> {
  const response = await request.post(`${baseApiUrl}/users/signin`, {
    data: {
      login: userLogin,
      password: userPassword,
    },
  });
  const responseBody = await response.json();
  return responseBody.token;
}

export async function setAuthCookie(token: string): Promise<void> {
  await playwrightObject.context.addCookies([
    {
      name: "jwt",
      value: token,
      domain: "localhost",
      path: "/",
      httpOnly: true,
    },
  ]);
}
