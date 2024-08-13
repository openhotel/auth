import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";

export const verifySessionRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/verify-session",
  func: async (request, url) => {
    let { sessionId, token } = await request.json();

    //check

    if (!sessionId || !token)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { value: accountBySession } = await System.db.get([
      "accountsBySession",
      sessionId,
    ]);

    if (!accountBySession)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { value: account } = await System.db.get([
      "accounts",
      accountBySession,
    ]);

    if (!account)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const result = bcrypt.compareSync(token, account.tokenHash);

    if (!result)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    delete account.tokenHash;

    await System.db.set(["accounts", account.accountId], account);
    await System.db.delete(["accountsBySession", sessionId]);

    return Response.json(
      {
        status: 200,
        data: {
          accountId: account.accountId,
          username: account.username,
        },
      },
      {
        status: 200,
      },
    );
  },
};
