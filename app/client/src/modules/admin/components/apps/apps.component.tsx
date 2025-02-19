import { useAdmin } from "shared/hooks";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
//@ts-ignore
import styles from "./apps.module.scss";
import { ButtonComponent, InputComponent } from "@oh/components";

export const AdminAppsComponent = () => {
  const { apps, addApp, removeApps, fetchApps } = useAdmin();

  const [lastThirdPartyToken, setLastThirdPartyToken] = useState<string>(null);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const data = new FormData(event.target as unknown as HTMLFormElement);
      const url = data.get("url") as string;

      if (!url) return;

      const rawToken = await addApp(url);
      setLastThirdPartyToken(rawToken);
    },
    [setLastThirdPartyToken],
  );

  const onDelete = useCallback(
    (id: string) => async () => removeApps(id),
    [removeApps],
  );

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  return (
    <div className={styles.tokens}>
      <h2>Apps</h2>
      <div className={styles.list}>
        {apps.map((token, index) => (
          <div className={styles.item} key={token.id}>
            <label>{token.url}</label>
            <label>{token.id}</label>
            {lastThirdPartyToken && index === apps.length - 1 ? (
              <label>{lastThirdPartyToken}</label>
            ) : null}
            <ButtonComponent onClick={onDelete(token.id)}>
              delete
            </ButtonComponent>
          </div>
        ))}
        <form className={styles.item} onSubmit={onSubmit}>
          <InputComponent placeholder="url" name="url" />
          <ButtonComponent>Add</ButtonComponent>
        </form>
      </div>
    </div>
  );
};
