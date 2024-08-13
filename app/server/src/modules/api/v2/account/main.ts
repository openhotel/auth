import { RequestType } from "shared/types/main.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { registerRequest } from "./register.request.ts";
import { loginRequest } from "./login.request.ts";
import { verifyRequest } from "./verify.request.ts";
import { refreshSessionRequest } from "./refresh-session.request.ts";

export const accountRequestList: RequestType[] = getPathRequestList({
  requestList: [
    registerRequest,
    loginRequest,
    verifyRequest,
    refreshSessionRequest,
  ],
  pathname: "/account",
});
