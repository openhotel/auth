import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import { USER_1 } from "../consts.ts";

import { STATE } from "../state.ts";

describe("4. refresh account tokens", () => {
  it("refreshes incorrectly account session", async () => {
    const { status, data } = await fetcher("/account/refresh", {
      method: "GET",
      headers: {
        "account-id": STATE.getUser(USER_1.email).accountId,
      },
    });
    assertEquals(status, 403);
    assertEquals(data, undefined);
  });

  it("refreshes account session", async () => {
    const { status, data } = await fetcher("/account/refresh", {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(status, 200);
    assertExists(data.accountId);
    assertExists(data.durations);
    assertExists(data.refreshToken);
    assertExists(data.token);

    STATE.setUser(USER_1.email, data);
  });

  it("check if new session token work", async () => {
    const { status, data } = await fetcher("/user/@me", {
      method: "GET",
      headers: STATE.getSessionHeaders(USER_1.email),
    });
    assertEquals(status, 200);
    assertEquals(data, {
      accountId: STATE.getUser(USER_1.email).accountId,
      languages: USER_1.languages,
      username: USER_1.username,
    });
  });
});
