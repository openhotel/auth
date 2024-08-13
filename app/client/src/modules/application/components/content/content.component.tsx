import React from "react";
import styles from "./content.module.scss";

export const ContentComponent: React.FC = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};
