import { System } from "modules/system/main.ts";
import { DbAccount, AccountCreation } from "shared/types/account.types.ts";
import { getEmailHash, getEncryptedEmail } from "shared/utils/account.utils.ts";
import { pepperPassword } from "shared/utils/pepper.utils.ts";
import * as bcrypt from "@da/bcrypt";
import { getRandomString } from "@oh/utils";

import { otp } from "./accounts/otp.ts";
import { hotels } from "./accounts/hotels.ts";

export const accounts = () => {
  const create = async ({
    email,
    username,
    password,
    languages,
  }: AccountCreation) => {
    const {
      email: { enabled: isEmailVerificationEnabled },
      times: { accountWithoutVerificationDays },
    } = System.getConfig();

    const accountId = crypto.randomUUID();

    email = email.toLowerCase();
    const emailHash = await getEmailHash(email);

    const passWithPepper = await pepperPassword(password);
    const passwordHash = bcrypt.hashSync(passWithPepper, bcrypt.genSaltSync(8));

    const account: DbAccount = {
      accountId,
      username,
      emailHash,
      passwordHash,
      languages,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      verified: !isEmailVerificationEnabled,
    };

    const expireIn = accountWithoutVerificationDays * 24 * 60 * 60 * 1000;

    await System.db.set(
      ["accounts", accountId],
      account,
      isEmailVerificationEnabled ? { expireIn } : {},
    );
    // --- Email things
    {
      await System.db.set(
        ["accountsByEmail", emailHash],
        accountId,
        isEmailVerificationEnabled
          ? {
              expireIn,
            }
          : {},
      );
      const encryptedEmail = await getEncryptedEmail(email);
      await System.db.set(["emailsByHash", emailHash], encryptedEmail);
    }
    // --- Username things ---
    {
      await System.db.set(
        ["accountsByUsername", username.toLowerCase()],
        accountId,
        isEmailVerificationEnabled
          ? {
              expireIn,
            }
          : {},
      );
    }
    // --- Verification things ---
    {
      const verifyId = getRandomString(16);
      const verifyToken = getRandomString(32);

      const { url: apiUrl } = System.getConfig();

      await System.db.set(
        ["accountsByVerifyId", verifyId],
        {
          accountId,
          verifyTokensHash: isEmailVerificationEnabled
            ? bcrypt.hashSync(verifyToken, bcrypt.genSaltSync(8))
            : null,
        },
        {
          expireIn,
        },
      );

      const verifyUrl = `${apiUrl}/verify?id=${verifyId}&token=${verifyToken}`;

      System.email.send(
        email,
        "verify your account",
        verifyUrl,
        `<a href="${verifyUrl}">${verifyUrl}<p/>`,
      );
    }
  };

  const getList = async (): Promise<DbAccount[]> =>
    (await System.db.list({ prefix: ["accounts"] })).map(({ value }) => value);

  const get = async (accountId: string): Promise<DbAccount> =>
    await System.db.get(["accounts", accountId]);

  const getByUsername = async (username: string): Promise<DbAccount | null> => {
    const accountId = await System.db.get([
      "accountsByUsername",
      username.toLowerCase(),
    ]);
    if (!accountId) return null;
    return await get(accountId);
  };

  const getByEmail = async (email: string): Promise<DbAccount | null> => {
    const accountId = await System.db.get([
      "accountsByEmail",
      await getEmailHash(email.toLowerCase()),
    ]);
    if (!accountId) return null;
    return await get(accountId);
  };

  const getByRequest = async ({ headers }: Request): Promise<DbAccount> => {
    let accountId = headers.get("account-id");
    const connectionToken = headers.get("connection-token");

    if (!accountId && connectionToken) {
      const connection =
        await System.connections.getConnectionByRawToken(connectionToken);
      accountId = connection.accountId;
    }

    return await get(accountId);
  };

  const remove = async (accountId: string) => {
    const account = await get(accountId);

    await System.db.delete(["accounts", accountId]);
    await System.db.delete(["accountsByRefreshToken", accountId]);
    await System.db.delete(["accountsByToken", accountId]);
    await System.db.delete(["accountsByUsername", account.username]);

    await System.db.delete(["accountsByEmail", account.emailHash]);
    await System.db.delete(["emailsByHash", account.emailHash]);

    await otp(accountId).remove();

    await System.db.delete(["github", accountId]);
    await System.db.delete(["githubState", accountId]);

    await System.connections.removeAll(accountId);
    await System.hotels.removeAll(accountId);

    await System.db.delete(["hotelsByAccountId", accountId]);

    await System.admins.remove(accountId);
  };

  return {
    create,
    getList,
    get,
    getByUsername,
    getByEmail,
    getByRequest,
    remove,

    //
    otp,
    hotels,
  };
};
