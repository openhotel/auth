import React, { useMemo } from "react";
import {
  AccountIconComponent,
  AdminIconComponent,
  AnalyticsIconComponent,
  ButtonComponent,
  ConnectionsIconComponent,
  DatabaseIconComponent,
  HomeIconComponent,
  HotelIconComponent,
  KeysIconComponent,
  NavItemComponent,
} from "@openhotel/web-components";
import { LinkComponent } from "shared/components";
import { useAccount, useUser } from "shared/hooks";
//@ts-ignore
import styles from "./navigator.module.scss";

export const HomeNavigatorComponent: React.FC = () => {
  const { isLogged } = useAccount();
  const { user } = useUser();

  const isAdmin = useMemo(() => Boolean(user && user?.admin), [user]);

  if (!isLogged) return null;

  return (
    <div className={styles.navigator}>
      <LinkComponent to="/">
        <NavItemComponent icon={<HomeIconComponent />}>Home</NavItemComponent>
      </LinkComponent>
      <LinkComponent to="/hotels">
        <NavItemComponent icon={<HotelIconComponent />}>
          Public Hotels
        </NavItemComponent>
      </LinkComponent>
      <hr />
      <LinkComponent to="/account">
        <NavItemComponent icon={<AccountIconComponent />}>
          Account
        </NavItemComponent>
      </LinkComponent>
      <LinkComponent to="/account/my-hotels">
        <NavItemComponent icon={<HotelIconComponent />}>
          My Hotels
        </NavItemComponent>
      </LinkComponent>
      <LinkComponent to="/account/connections">
        <NavItemComponent icon={<ConnectionsIconComponent />}>
          Connections
        </NavItemComponent>
      </LinkComponent>
      <LinkComponent to="/account/sessions">
        <NavItemComponent icon={<KeysIconComponent />}>
          Sessions
        </NavItemComponent>
      </LinkComponent>
      {isAdmin ? (
        <>
          <hr />
          <LinkComponent to="/admin">
            <NavItemComponent icon={<AdminIconComponent />}>
              Admin
            </NavItemComponent>
          </LinkComponent>
          <LinkComponent to="/admin/users">
            <NavItemComponent icon={<AccountIconComponent />}>
              Users
            </NavItemComponent>
          </LinkComponent>
          <LinkComponent to="/admin/hotels">
            <NavItemComponent icon={<HotelIconComponent />}>
              Hotels
            </NavItemComponent>
          </LinkComponent>
          <LinkComponent to="/admin/backups">
            <NavItemComponent icon={<DatabaseIconComponent />}>
              Backups
            </NavItemComponent>
          </LinkComponent>
          <LinkComponent to="/admin/analytics">
            <NavItemComponent icon={<AnalyticsIconComponent />}>
              Analytics
            </NavItemComponent>
          </LinkComponent>
        </>
      ) : null}
      <LinkComponent to="/logout" className={styles.logout}>
        Logout
      </LinkComponent>
    </div>
  );
};
