import Cookies from "js-cookie";

export const useCookies = () => {
  const set = (key: string, value: string, expires?: number) => {
    Cookies.set(key, value, {
      expires,
      sameSite: "None",
      secure: true,
      partitioned: true,
    });
  };

  const get = Cookies.get;
  const remove = Cookies.remove;

  return {
    set,
    get,
    remove,
  };
};