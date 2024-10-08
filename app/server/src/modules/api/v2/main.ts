import { RequestType, getPathRequestList } from "@oh/utils";

import { versionRequest } from "./version.request.ts";
import { accountRequestList } from "./account/main.ts";
import { serverRequestList } from "./server/main.ts";
import { adminRequestList } from "./admin/main.ts";

export const requestV2List: RequestType[] = getPathRequestList({
  requestList: [
    versionRequest,
    ...accountRequestList,
    ...serverRequestList,
    ...adminRequestList,
  ],
  pathname: "/api/v2",
});
