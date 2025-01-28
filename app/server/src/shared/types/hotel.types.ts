import { DbHotelIntegrationType } from "shared/enums/hotel.enums.ts";

export type DbHotel = {
  accountId: string;
  hotelId: string;
  name: string;
  public: boolean;
};

export type DbHotelIntegration = {
  integrationId: string;
  name: string;
  redirectUrl: string;
  type: DbHotelIntegrationType;
  hotel: number;
  accounts: number;
};
