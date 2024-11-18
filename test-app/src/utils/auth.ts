import { APIRequestContext, Page } from "@playwright/test";

import configuration from "../../configuration.json";

export async function quickApiLogin(
  request: APIRequestContext
): Promise<string> {
  const { userLogin, userPassword } = configuration;
  const response = await request.post(
    `${configuration.baseApiUrl}/users/signin`,
    {
      data: {
        login: userLogin,
        password: userPassword,
      },
    }
  );
  const responseBody = await response.json();
  return responseBody.token;
}

export async function setAuthCookie(page: Page, token: string): Promise<void> {
  await page.context().addCookies([
    {
      name: "jwt",
      value: token,
      domain: "localhost:6699", // FIXME: change me post production
      path: "/",
    },
  ]);
}
