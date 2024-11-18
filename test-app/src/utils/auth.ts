import { APIRequestContext, Page } from "@playwright/test";

import configuration from "../../configuration.json";

export async function quickApiLogin(request: APIRequestContext): Promise<void> {
  const { userLogin, userPassword } = configuration;
  const response = await request.post("api/v1/users/signin", {
    data: {
      login: userLogin,
      password: userPassword,
    },
  });

  const asd = await response.json();
  console.log(asd);
}

export async function setAuthCookie(page: Page, token: string): Promise<void> {
  await page.context().addCookies([
    {
      name: "jwt",
      value: token,
    },
  ]);
}
