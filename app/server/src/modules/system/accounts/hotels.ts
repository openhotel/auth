import { DbHotel } from "shared/types/hotel.types.ts";
import { System } from "modules/system/main.ts";

export const hotels = (accountId: string) => {
  const getList = async (): Promise<DbHotel[]> => {
    const hotelIdList =
      (await System.db.get(["hotelsByAccountId", accountId])) || [];
    return await Promise.all(hotelIdList.map(System.hotels.get));
  };

  return {
    getList,
  };
};
