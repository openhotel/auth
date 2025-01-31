import {
  AccountConnection,
  AccountConnectionMutable,
  DbAccount,
  DbAccountConnection,
} from "shared/types/account.types.ts";
import { System } from "modules/system/main.ts";
import { Scope } from "shared/enums/scopes.enums.ts";
import { generateToken, getIpFromRequest } from "@oh/utils";
import { Connection } from "shared/types/connection.types.ts";

export const connection = (account: DbAccount): AccountConnectionMutable => {
  const create = async ({
    hotelId,
    integrationId,
    request,
    scopes: unfilteredScopes,
    state,
  }: AccountConnection): Promise<string | null> => {
    const hotel = await System.hotels.getHotel({ hotelId });
    if (!hotel) return null;

    const integration = hotel.getIntegration({ integrationId });
    if (!integration) return null;

    //remove previous connection
    await remove();

    const { token, id: connectionId, tokenHash } = generateToken("con", 24, 32);

    const {
      times: { connectionTokenMinutes },
    } = System.getConfig();
    const expireIn = connectionTokenMinutes * 60 * 1000;

    const scopes = unfilteredScopes.filter((scope) =>
      Object.values(Scope).includes(scope as Scope),
    );

    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

    await System.db.set(
      ["accountByConnectionId", connectionId],
      account.accountId,
      {
        expireIn,
      },
    );
    await System.db.set(
      ["connections", account.accountId],
      {
        connectionId,

        hotelId,
        integrationId,

        accountId: account.accountId,
        userAgent,
        ip,

        scopes,

        tokenHash,
      } as Connection,
      {
        expireIn,
      },
    );

    const $account = await System.accounts.getAccount({
      accountId: account.accountId,
    });

    const foundIntegration = await $account.integrations.getIntegration(
      hotelId,
      integrationId,
    );

    if (foundIntegration)
      await $account.integrations.update(hotelId, integrationId);
    else
      await $account.integrations.create({
        hotelId,
        integrationId,
        scopes,
      });

    const url = new URL(integration.getObject().redirectUrl);
    url.searchParams.append("state", state);
    url.searchParams.append("token", token);

    if (scopes?.length) url.searchParams.append("scopes", scopes.join(","));

    return url.href;
  };

  const get = async (): Promise<DbAccountConnection | null> => {
    return await System.db.get(["connections", account.accountId]);
  };

  const remove = async () => {
    const connection = await get();
    if (!connection) return;

    await System.db.delete(["accountByConnectionId", connection.connectionId]);
    await System.db.delete(["connections", account.accountId]);
  };

  const ping = async (connectionId: string, request: Request) => {
    const connection = await get();

    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

    if (
      !connection ||
      connection.connectionId !== connectionId ||
      connection.userAgent !== userAgent ||
      connection.ip !== ip
    )
      return null;

    const {
      times: { connectionTokenMinutes },
    } = System.getConfig();
    const expireIn = connectionTokenMinutes * 60 * 1000;

    await System.db.set(["connections", account.accountId], connection, {
      expireIn,
    });
    await System.db.set(
      ["accountByConnectionId", connection.connectionId],
      connection.accountId,
      {
        expireIn,
      },
    );

    const estimatedNextPingIn = expireIn / 2;

    return { estimatedNextPingIn };
  };

  const checkScopes = async (scopes: Scope[]): Promise<boolean> => {
    const connection = await get();
    if (!connection) return false;

    return scopes.every((scope) => connection.scopes.includes(scope));
  };

  return {
    create,
    remove,

    get,

    ping,
    checkScopes,
  };
};
