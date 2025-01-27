import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const verifyGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/verify",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const token = url.searchParams.get("token");
    if (!token) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getFromRequest(request);

    const { isVerified, check, verify } = System.accounts.otp(
      account.accountId,
    );

    if (await isVerified()) return getResponse(HttpStatusCode.CONFLICT);
    if (!(await check(token))) return getResponse(HttpStatusCode.FORBIDDEN);

    await verify();

    return getResponse(HttpStatusCode.OK);
  },
};
