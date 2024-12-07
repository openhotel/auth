import {
  RequestType,
  RequestMethod,
  getRandomString,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import {
  PASSWORD_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
} from "shared/consts/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { Account } from "shared/types/account.types.ts";

export const changePassPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/change-pass",
  kind: RequestKind.PUBLIC,
  func: async (request, url) => {
    const { password, rePassword, token } = await request.json();

    if (!password || !rePassword || !token) {
      return Response.json(
        {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Some input is missing",
        },
        {
          status: HttpStatusCode.BAD_REQUEST,
        },
      );
    }

    if (!new RegExp(PASSWORD_REGEX).test(password) || password !== rePassword) {
      return Response.json(
        { status: HttpStatusCode.BAD_REQUEST, message: "Invalid password" },
        {
          status: HttpStatusCode.BAD_REQUEST,
        },
      );
    }

    const recoverRequest = await System.db.get(["passRecoverRequests", token]);

    if (!recoverRequest) {
      return Response.json(
        {
          status: HttpStatusCode.BAD_REQUEST,
          message:
            "Recover password request has expired, please send a new one",
        },
        { status: HttpStatusCode.BAD_REQUEST },
      );
    }

    const account: Account | undefined = await System.db.get([
      "accounts",
      recoverRequest.accountId,
    ]);

    if (!account) {
      return Response.json(
        {
          status: HttpStatusCode.NOT_FOUND,
          message: "Account is gone",
        },
        { status: HttpStatusCode.NOT_FOUND },
      );
    }

    account.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));

    await System.db.set(["accounts", recoverRequest.accountId], account);

    await System.db.delete(["passRecoverRequests", token]);

    return Response.json(
      {
        status: HttpStatusCode.OK,
      },
      {
        status: HttpStatusCode.OK,
      },
    );
  },
};
