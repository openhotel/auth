import { RequestType } from "shared/types/main.ts";
import { getPathRequestList } from "shared/utils/main.ts";
import { verifySessionRequest } from "./verify-session.request.ts";

export const serverRequestList: RequestType[] = getPathRequestList({
  requestList: [verifySessionRequest],
  pathname: "/server",
});
