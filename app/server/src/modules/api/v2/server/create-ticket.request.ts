import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";
import { TICKET_EXPIRE_TIME } from "shared/consts/tickets.consts.ts";

export const createTicketRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/create-ticket",
  func: async (request, url) => {
    let { ticketKey, redirectUrl } = await request.json();

    if (!ticketKey || !redirectUrl)
      return Response.json(
        { status: 400 },
        {
          status: 400,
        },
      );

    const ticketId = crypto.randomUUID();
    await System.db.set(
      ["tickets", ticketId],
      {
        ticketId,
        ticketKeyHash: bcrypt.hashSync(ticketKey, bcrypt.genSaltSync(8)),
        redirectUrl,
        isUsed: false,
      },
      {
        expireIn: TICKET_EXPIRE_TIME,
      },
    );

    return Response.json({
      status: 200,
      data: {
        ticketId,
      },
    });
  },
};