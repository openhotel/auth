import { System } from "modules/system/main.ts";
import { generateToken, getTokenData } from "@oh/utils";
import * as bcrypt from "@da/bcrypt";

export const hotels = () => {
  const getList = async () => {
    const hotelList = await System.db.list({ prefix: ["hotels"] });
    return hotelList.map(({ value }) => value);
  };

  const getPrivateList = async () => {
    const list = await getList();
    return await Promise.all(
      list.map((hotel) => {
        return hotel;
      }),
    );
  };

  const getListByAccountId = async (accountId: string) => {
    const hotelsIdList =
      (await System.db.get(["hotelsByAccountId", accountId])) || [];

    return await Promise.all(
      hotelsIdList.map(async (hotelId: string) => {
        const hotel = await getHotel(hotelId);

        hotel.integrations = await Promise.all(
          hotel.integrations.map(async (integration) => {
            const accounts = (
              await System.db.list({
                prefix: ["integrationsByHotelsByAccountId"],
              })
            ).filter(
              ({ key }) =>
                key[2] === hotelId && key[3] === integration.integrationId,
            ).length;
            return { ...integration, accounts };
          }),
        );

        return hotel;
      }),
    );
  };

  const getHotel = async (hotelId: string) => {
    return await System.db.get(["hotels", hotelId]);
  };

  const add = async (accountId: string, name: string) => {
    const hotelId = crypto.randomUUID();

    await System.db.set(["hotels", hotelId], {
      hotelId,
      name,
      accountId,
      integrations: [],
    });

    const hotelsIdList =
      (await System.db.get(["hotelsByAccountId", accountId])) || [];

    if (hotelsIdList.length >= System.getConfig().accounts.maxHotels)
      return null;

    hotelsIdList.push(hotelId);
    await System.db.set(["hotelsByAccountId", accountId], hotelsIdList);

    return {
      hotelId,
    };
  };

  const update = async (hotelId: string, name: string) => {
    const hotel = await getHotel(hotelId);
    if (!hotel) return;

    const data = {
      ...hotel,
      name,
    };

    await System.db.set(["hotels", hotelId], data);

    return data;
  };

  const remove = async (hotelId: string) => {
    const hotel = await System.db.get(["hotels", hotelId]);
    if (!hotel) return;

    const hotelsIdList =
      (await System.db.get(["hotelsByAccountId", hotel.accountId])) || [];
    await System.db.set(
      ["hotelsByAccountId", hotel.accountId],
      hotelsIdList.filter(($hotelId: string) => hotelId !== $hotelId),
    );

    for (const { integrationId } of hotel.integrations)
      await System.db.delete(["hotelsByConnectId", integrationId]);

    await System.db.delete(["hotels", hotelId]);
  };

  const integrations = (() => {
    const add = async (
      hotelId: string,
      name: string,
      redirectUrl: string,
      type: "web" | "client",
    ) => {
      const hotel = await getHotel(hotelId);
      if (!hotel) return;

      const integrationId = crypto.randomUUID();

      await System.db.set(["hotels", hotelId], {
        ...hotel,
        integrations: [
          ...hotel.integrations,
          {
            integrationId,
            name,
            redirectUrl,
            type,
          },
        ],
      });

      return integrationId;
    };

    const $generateToken = async (hotelId: string, integrationId: string) => {
      const hotel = await getHotel(hotelId);
      if (!hotel) return;

      const founIntegration = hotel.integrations.find(
        ({ integrationId: $integrationId }) => integrationId === $integrationId,
      );
      if (!founIntegration) return;

      const accountId = hotel.accountId;
      const { token, id, tokenHash } = generateToken("lic", 16, 32);

      const licenseId = await System.db.get([
        "licensesByIntegrationId",
        integrationId,
      ]);
      if (licenseId) await System.db.delete(["licenses", licenseId]);

      await System.db.set(["licenses", id], {
        id,
        tokenHash,
        hotelId,
        integrationId,
        accountId,
        updatedAt: Date.now(),
      });
      await System.db.set(["licensesByIntegrationId", integrationId], id);

      return token;
    };

    const getLicense = async (licenseToken: string) => {
      const { id: licenseId } = getTokenData(licenseToken);

      const license = await System.db.get(["licenses", licenseId]);
      if (!license) return null;

      return {
        hotelId: license.hotelId,
        integrationId: license.integrationId,
        accountId: license.accountId,
      };
    };

    const remove = async (hotelId: string, integrationId: string) => {
      const hotel = await getHotel(hotelId);
      if (!hotel) return;

      hotel.integrations = hotel.integrations.filter(
        (integration) => integration.integrationId !== integrationId,
      );
      await System.db.set(["hotels", hotelId], hotel);

      const licenseId = await System.db.get([
        "licensesByIntegrationId",
        integrationId,
      ]);
      if (licenseId) {
        await System.db.delete(["licensesByIntegrationId", integrationId]);
        await System.db.delete(["licenses", licenseId]);
      }
    };

    const verify = async (token: string): Promise<boolean> => {
      if (!token) return false;

      const { id: licenseId, token: licenseToken } = getTokenData(token);
      if (!licenseId || !licenseToken) return false;

      const license = await System.db.get(["licenses", licenseId]);
      if (!license) return false;

      return bcrypt.compareSync(licenseToken, license.tokenHash);
    };

    return {
      getLicense,
      add,
      generateToken: $generateToken,
      remove,
      verify,
    };
  })();

  return {
    add,
    get: getHotel,
    update,
    getList,
    remove,
    getListByAccountId,

    integrations,
  };
};
