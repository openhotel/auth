import {
  AccountIntegrationCreation,
  AccountIntegrations,
  DbAccount,
  DbAccountIntegration,
} from "shared/types/account.types.ts";
import { System } from "modules/system/main.ts";

export const integrations = (account: DbAccount): AccountIntegrations => {
  const getIntegrations = async (): Promise<DbAccountIntegration[]> => {
    return (
      await System.db.list({
        prefix: ["integrationsByAccountId", account.accountId],
      })
    ).map(({ value }) => value);
  };

  const getIntegration = async (hotelId: string, integrationId: string) => {
    return System.db.get([
      "integrationsByAccountId",
      account.accountId,
      hotelId,
      integrationId,
    ]);
  };

  const update = async (hotelId: string, integrationId: string) => {
    const integration = await getIntegration(hotelId, integrationId);
    if (!integration) return;

    await System.db.set(
      ["integrationsByAccountId", account.accountId, hotelId, integrationId],
      {
        ...integration,
        updatedAt: Date.now(),
      },
    );
  };

  const create = async ({
    hotelId,
    integrationId,
    scopes,
  }: AccountIntegrationCreation) => {
    await System.db.set(
      ["integrationsByAccountId", account.accountId, hotelId, integrationId],
      {
        accountId: account.accountId,

        hotelId,
        integrationId,

        scopes,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    );
  };

  const remove = async (hotelId: string, integrationId: string) =>
    await System.db.delete([
      "integrationsByAccountId",
      account.accountId,
      hotelId,
      integrationId,
    ]);

  const removeAll = async () => {
    await System.db.delete(["integrationsByAccountId", account.accountId]);
  };

  return {
    getIntegrations,
    getIntegration,

    update,

    create,
    remove,
    removeAll,
  };
};
