import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  url: string;
};

export const RedirectComponent: React.FC<Props> = ({ url = [] }) => {
  return <Navigate replace to={url + location.hash} />;
};
