import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RedirectComponent } from "shared/components";
import { useAccount, useConnection, useRedirect } from "shared/hooks";
import { Hotel } from "shared/types";
import { arraysMatch } from "shared/utils";

export const ConnectionComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { refresh, isLogged } = useAccount();
  const { add, get } = useConnection();
  const { set: setRedirect } = useRedirect();

  const [host, setHost] = useState<Hotel | null>(undefined);

  const state = searchParams.get("state");
  const redirectUrl = searchParams.get("redirectUrl");
  const scopes = searchParams.get("scopes")?.split(",") || [];
  const meta = searchParams.get("meta");

  const onAddHost = useCallback(() => {
    add(state, redirectUrl, scopes).then(({ data: { redirectUrl } }) => {
      const composedRedirectUrl = new URL(redirectUrl);
      if (meta) composedRedirectUrl.searchParams.append("meta", meta);
      window.location.replace(composedRedirectUrl);
    });
  }, [add, state, redirectUrl, scopes, meta]);

  if (!state || !redirectUrl) return <RedirectComponent to="/" />;

  useEffect(() => {
    setRedirect(redirectUrl);
  }, [redirectUrl]);

  useEffect(() => {
    if (isLogged === null) return;
    try {
      refresh().then(() => {
        const redirectUrlParsed = new URL(redirectUrl);
        get(redirectUrlParsed.hostname).then((host) => {
          if (!host) return setHost(null);
          if (arraysMatch(host.scopes, scopes)) return onAddHost();

          setHost(host);
        });
      });
    } catch (e) {
      navigate("/");
    }
  }, [isLogged]);

  if (isLogged !== null && !isLogged) return <RedirectComponent to="/login" />;
  if (host === undefined) return <div>loading...</div>;

  return (
    <div>
      <label>connection</label>
      <p>{redirectUrl}</p>
      <p>{scopes.join(", ")}</p>

      <button onClick={onAddHost}>Continue...</button>
    </div>
  );
};
