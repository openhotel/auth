import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals, assertExists } from "jsr:@std/assert";

import { fetcher } from "../utils.ts";
import {
  INVALID_EMAILS,
  INVALID_LANGUAGE,
  INVALID_PASSWORD,
  INVALID_USERNAMES,
  USER_1,
} from "../consts.ts";

import { STATE } from "../state.ts";

describe("5. recover account", () => {});
