import { RequestType, getPathRequestList } from "@oh/utils";

import { loginPostRequest } from "./login.request.ts";
import { registerPostRequest } from "./registerRequest.ts";
import { verifyGetRequest } from "./verify.request.ts";
import { refreshGetRequest } from "./refresh.request.ts";
import { logoutPostRequest } from "./logout.request.ts";
import { otpRequestList } from "./otp/main.ts";
import { miscRequestList } from "./misc/main.ts";
import { recoverPassPostRequest } from "./recover-pass.request.ts";
import { changePassPostRequest } from "./change-pass.request.ts";

export const accountRequestList: RequestType[] = getPathRequestList({
  requestList: [
    loginPostRequest,
    registerPostRequest,
    verifyGetRequest,
    refreshGetRequest,
    logoutPostRequest,
    recoverPassPostRequest,
    changePassPostRequest,

    ...otpRequestList,
    ...miscRequestList,
  ],
  pathname: "/account",
});
