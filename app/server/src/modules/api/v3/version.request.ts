import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { HttpResponse } from "shared/utils/http-response.utils.ts";

export const versionRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/version",
  kind: RequestKind.PUBLIC,
  func: (request, url) => {
    return HttpResponse.ok({ data: { version: System.getEnvs().version } });
  },
};
