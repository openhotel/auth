import { RequestType, RequestMethod, getIpFromRequest } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { SERVER_SESSION_EXPIRE_TIME } from "shared/consts/main.ts";

export const pingRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/ping",
  func: async (request, url) => {
    const { accountId, server, ticketId } = await request.json();

    if (!accountId || !server || !ticketId)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    // const account = await getAccountFromRequest(request);
    const serverSession = await System.db.get([
      "serverSessionByAccount",
      accountId,
    ]);

    if (!serverSession)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const ip = getIpFromRequest(request);

    if (
      serverSession?.ip !== ip ||
      serverSession?.server !== server ||
      serverSession?.ticketId !== ticketId
    )
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    //update expire in time
    await System.db.set(["serverSessionByAccount", accountId], serverSession, {
      expireIn: SERVER_SESSION_EXPIRE_TIME,
    });

    return Response.json(
      {
        status: 200,
      },
      { status: 200 },
    );
  },
};
