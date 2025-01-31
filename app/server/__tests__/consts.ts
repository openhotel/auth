import { LANGUAGE_LIST } from "../src/shared/consts/language.consts.ts";

export const USER_1 = {
  email: "Jorji@Obristan.obr",
  username: "Jorji",
  password: "*dry$yVnidc0Utp}_Da*($P}kQ&_M{",
  languages: [LANGUAGE_LIST[2], LANGUAGE_LIST[20], LANGUAGE_LIST[42]],
};

export const INVALID_USERNAMES = ["  asd", "_", "1", "%asdsa", "$#(&%"];
export const INVALID_EMAILS = ["asdasd", "asd@asdasd", "asdasd.com"];
export const INVALID_PASSWORD = ["abde345"];
export const INVALID_LANGUAGE = ["arstotzkan"];
