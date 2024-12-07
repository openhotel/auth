import { RequestType, RequestMethod, getRandomString } from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import {
  PASSWORD_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
} from "shared/consts/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const recoverPassPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/recover-pass",
  kind: RequestKind.PUBLIC,
  func: async (request, url) => {
    const { email } = await request.json();

    if (!email || !new RegExp(EMAIL_REGEX).test(email)) {
      return Response.json(
        { status: 400, message: "Invalid email" },
        {
          status: 400,
        },
      );
    }

    const accountId = await System.db.get(["accountsByEmail", email]);

    if (!accountId) {
      // Don't tell the client if the email exists or not, to prevent email enumeration
      console.warn("Recover password request for non-existent email:", email);
      return Response.json({ status: 200 }, { status: 200 });
    }

    const isEmailEnabled = System.getConfig().email.enabled;

    if (!isEmailEnabled) {
      return Response.json(
        { status: 500, message: "Disabled: cannot send email" },
        { status: 500 },
      );
    }

    const verifyToken = getRandomString(16);
    const { url: rootUrl } = System.getConfig();

    const verifyUrl = `${rootUrl}/change-pass?token=${verifyToken}`;

    console.debug("Sending email to", email, "with url", verifyUrl);
    System.email.send(
      email,
      "Change your account password",
      verifyUrl,
      `<a href="${verifyUrl}">${verifyUrl}<p/>`,
    );

    await System.db.set(
      ["passRecoverRequests", verifyToken],
      {
        accountId,
        email,
        token: verifyToken,
        createdAt: Date.now(),
      },
      { expireIn: 60 * 60 * 1000 /* 1h */ },
    );

    return Response.json(
      {
        status: 200,
      },
      {
        status: 200,
      },
    );
  },
};
