import { RequestType, RequestMethod, getRandomString } from "@oh/utils";
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
        { status: 400, message: "Some input is missing" },
        {
          status: 400,
        },
      );
    }

    if (!new RegExp(PASSWORD_REGEX).test(password) || password !== rePassword) {
      return Response.json(
        { status: 400, message: "Invalid password" },
        {
          status: 400,
        },
      );
    }

    const recoverRequest = await System.db.get(["passRecoverRequests", token]);

    if (!recoverRequest) {
      return Response.json(
        {
          status: 400,
          message:
            "Recover password request has expired, please send a new one",
        },
        { status: 400 },
      );
    }

    const account: Account | undefined = await System.db.get([
      "accounts",
      recoverRequest.accountId,
    ]);

    if (!account) {
      return Response.json(
        {
          status: 404,
          message: "Account is gone",
        },
        { status: 404 },
      );
    }

    account.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));

    await System.db.set(["accounts", recoverRequest.accountId], account);

    await System.db.delete(["passRecoverRequests", token]);

    return Response.json(
      {
        status: 200,
      },
      {
        status: 200,
      },
    );
  },
};
