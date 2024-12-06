import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Hotel } from "shared/types";
import { useHotels } from "shared/hooks";
import { ButtonComponent, InputComponent } from "@oh/components";
import { HotelComponent } from "./components";

//@ts-ignore
import styles from "./hotels.module.scss";

type Props = {} & React.HTMLProps<HTMLDivElement>;

export const HotelsComponent: React.FC<Props> = () => {
  const { get, create } = useHotels();

  const [hotels, setHotels] = useState<Hotel[]>([]);

  const $reload = useCallback(() => get().then(setHotels), [get, setHotels]);

  useEffect(() => {
    $reload();
  }, []);

  const onRemoveIntegration = useCallback(
    (hotelId: string) => (integrationId: string) => () => {
      setHotels((hotels) =>
        hotels.map((hotel) =>
          hotel.hotelId === hotelId
            ? {
                ...hotel,
                integrations: hotel.integrations.filter(
                  (integration) => integration.integrationId !== integrationId,
                ),
              }
            : hotel,
        ),
      );
    },
    [setHotels],
  );

  const onSubmitHotel = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const name = data.get("name") as string;

      if (!name) return;

      create(name).then($reload);
    },
    [$reload],
  );

  return (
    <div>
      <h2>Hotels</h2>
      <div className={styles.list}>
        {hotels.map((hotel) => (
          <HotelComponent
            key={hotel.hotelId}
            className={styles.hotel}
            hotel={hotel}
            onRemoveIntegration={onRemoveIntegration(hotel.hotelId)}
            refresh={$reload}
          />
        ))}

        <div className={styles.hotel} onSubmit={onSubmitHotel}>
          <form className={styles.form}>
            <InputComponent placeholder="name" name="name" />
            <ButtonComponent>Add hotel</ButtonComponent>
          </form>
        </div>
      </div>
    </div>
  );
};