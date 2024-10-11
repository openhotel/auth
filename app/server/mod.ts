// import { System } from "modules/system/main.ts";
// import { load as loadEnv } from "loadenv";
// import { getProcessedEnvs } from "shared/utils/main.ts";
//
// const envs = getProcessedEnvs({
//   version: "__VERSION__",
// });
//
// loadEnv();
// await System.load(envs);

const kv = await Deno.openKv("./database_abc");

for await (const entry of kv.list({ prefix: ["servers"] })) {
  console.log(await kv.get(entry.key));
}
