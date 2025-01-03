import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";
import { getEmailByHash } from "shared/utils/account.utils.ts";

export const emailGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/email",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getFromRequest(request);
    const email = await getEmailByHash(account.emailHash);

    return getResponse(HttpStatusCode.OK, {
      data: {
        email,
      },
    });
  },
};
