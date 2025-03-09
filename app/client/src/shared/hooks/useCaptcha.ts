import { useApi } from "./useApi";
import { useCallback, useState } from "react";
import { RequestMethod } from "shared/enums";
import { useAccount } from "./useAccount";

export const useCaptcha = () => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const get = useCallback(
    () =>
      fetch({
        method: RequestMethod.GET,
        headers: getAccountHeaders(),
        pathname: "/account/captcha",
      }),
    [fetch, getAccountHeaders],
  );

  return {
    get,
  };
};
