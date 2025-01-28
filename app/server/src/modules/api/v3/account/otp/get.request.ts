import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { getEmailByHash } from "shared/utils/account.utils.ts";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getByRequest(request);
    const otp = System.accounts.otp(account.accountId);

    if (await otp.isVerified()) return getResponse(HttpStatusCode.CONFLICT);

    const uri = await otp.create();

    return getResponse(HttpStatusCode.OK, { data: { uri } });
  },
};
