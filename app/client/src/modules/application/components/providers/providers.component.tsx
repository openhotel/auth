import { Outlet } from "react-router";
import { CaptchaV2Provider, TitleProvider, UserProvider } from "shared/hooks";
import React from "react";
import { ModalProvider } from "@openhotel/web-components";

export const ProvidersComponent = () => {
  return (
    <CaptchaV2Provider>
      <TitleProvider>
        <ModalProvider>
          <UserProvider>
            <Outlet />
          </UserProvider>
        </ModalProvider>
      </TitleProvider>
    </CaptchaV2Provider>
  );
};
