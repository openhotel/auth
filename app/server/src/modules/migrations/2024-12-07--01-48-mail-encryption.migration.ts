import { Migration, DbMutable, encrypt, decrypt } from "@oh/utils";

export default {
  id: "2024-12-07--01-48-mail-encryption",
  description: "Encrypt user email addresses stored in the database",
  up: async (db: DbMutable) => {
    const DB_SECRET_KEY = Deno.env.get("DB_SECRET_KEY");
    if (!DB_SECRET_KEY) {
      throw new Error("DB_SECRET_KEY not found");
    }

    // accounts
    const accounts = await db.list({ prefix: ["accounts"] });
    for await (const account of accounts) {
      const accountKey = account.key;
      const accountValue = account.value;

      const email = await encrypt(accountValue.email, DB_SECRET_KEY);
      await db.set(accountKey, { ...accountValue, email });
    }

    // accountsByEmail
    const accountsByEmail = await db.list({ prefix: ["accountsByEmail"] });
    for await (const account of accountsByEmail) {
      const oldKey = account.key;
      const email = oldKey[1];
      const accountValue = account.value;

      if (email) {
        const encryptedEmail = await encrypt(email, DB_SECRET_KEY);

        await db.set(["accountsByEmail", encryptedEmail], accountValue);
        await db.delete(oldKey);
      }
    }
  },
  down: async (db: DbMutable) => {
    const DB_SECRET_KEY = Deno.env.get("DB_SECRET_KEY");
    if (!DB_SECRET_KEY) {
      throw new Error("DB_SECRET_KEY not found");
    }
    // accounts
    const accounts = await db.list({ prefix: ["accounts"] });
    for await (const account of accounts) {
      const accountKey = account.key;
      const accountValue = account.value;

      const email = await decrypt(accountValue.email, DB_SECRET_KEY);
      await db.set(accountKey, { ...accountValue, email });
    }

    // accountsByEmail
    const accountsByEmail = await db.list({ prefix: ["accountsByEmail"] });
    for await (const account of accountsByEmail) {
      const oldKey = account.key;
      const email = oldKey[1];
      const accountValue = account.value;

      if (email) {
        const decryptedEmail = await decrypt(email, DB_SECRET_KEY);

        await db.set(["accountsByEmail", decryptedEmail], accountValue);
        await db.delete(oldKey);
      }
    }
  },
} as Migration;
