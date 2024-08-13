import React, { useEffect } from "react";
import styles from "./content.module.scss";
import { useApi } from "shared/hooks";

type Props = {
  children?: React.ReactNode;
};

export const ContentComponent: React.FC<Props> = ({ children }) => {
  const { refreshSession } = useApi();

  useEffect(() => {
    if (window.location.pathname === "/logout") return;

    refreshSession()
      .then(({ sessionId, token }) => {
        console.log(
          "https://client.openhotel.club/" +
            `#sessionId=${sessionId}&token=${token}`,
        );
        // window.location.href =
        //   "https://client.openhotel.club/" +
        //   `#sessionId=${sessionId}&token=${token}`;
      })
      .catch(() => {
        console.log("Cannot refresh session!");
      });
  }, [refreshSession]);

  return <div className={styles.content}>{children}</div>;
};
