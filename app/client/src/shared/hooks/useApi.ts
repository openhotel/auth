import Cookies from "js-cookie";

export const useApi = () => {
  const $getTicketId = () =>
    new URLSearchParams(location.hash).get("#ticketId");

  const login = (email: string, password: string, captchaId: string) =>
    new Promise((resolve, reject) => {
      fetch("/api/v2/account/login", {
        method: "POST",
        body: JSON.stringify({
          ticketId: $getTicketId(),

          email,
          password,
          captchaId,
        }),
      })
        .then((data) => data.json())
        .then(({ status, data }) => {
          if (status === 200) {
            Cookies.set("sessionId", data.sessionId, {
              expires: 7,
              sameSite: "strict",
            });
            Cookies.set("refreshToken", data.refreshToken, {
              expires: 7,
              sameSite: "strict",
            });
            return resolve(data);
          }
          reject();
        })
        .catch(reject);
    });

  const refreshSession = () =>
    new Promise((resolve, reject) => {
      const sessionId = Cookies.get("sessionId");
      const refreshToken = Cookies.get("refreshToken");

      if (!sessionId || !refreshToken) return reject();

      fetch("/api/v2/account/refresh-session", {
        method: "POST",
        body: JSON.stringify({
          ticketId: $getTicketId(),

          sessionId,
          refreshToken,
        }),
      })
        .then((data) => data.json())
        .then(({ status, data }) => {
          if (status === 200) {
            Cookies.set("sessionId", sessionId, {
              expires: 7,
              sameSite: "strict",
            });
            Cookies.set("refreshToken", data.refreshToken, {
              expires: 7,
              sameSite: "strict",
            });
            return resolve(data);
          }
          Cookies.remove("sessionId");
          Cookies.remove("refreshToken");
          reject();
        })
        .catch(reject);
    });

  const register = (
    email: string,
    username: string,
    password: string,
    captchaId: string,
  ) =>
    new Promise<void>((resolve, reject) => {
      fetch("/api/v2/account/register", {
        method: "POST",
        body: JSON.stringify({
          email,
          username,
          password,
          captchaId,
        }),
      })
        .then((data) => data.json())
        .then(({ status }) => (status === 200 ? resolve() : reject()))
        .catch(reject);
    });

  return {
    login,
    refreshSession,
    register,
  };
};
