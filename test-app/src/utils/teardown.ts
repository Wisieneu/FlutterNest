import { profile } from "console";
import { APIRequestContext } from "playwright";

const { baseApiUrl } = process.env;

// TODO: do this via backend's library API, so everything is made in one request with direct DB data manipulation, instead of multiple requests
export async function cleanupTestUserData(
  request: APIRequestContext
): Promise<void> {
  // await request.patch(`${baseApiUrl}/api/vi/users/me`, {
  //   data: {
  //     displayName: "automationtester",
  //     location: null,
  //     website: null,
  //     bio: null,
  //   },
  // });
}
