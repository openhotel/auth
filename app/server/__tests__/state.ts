export const State = () => {
  const getObject = (): any => {
    try {
      return JSON.parse(Deno.readTextFileSync("__state.json"));
    } catch (e) {
      return {};
    }
  };

  const setObject = (data: any) => {
    Deno.writeTextFileSync(
      "__state.json",
      JSON.stringify({
        ...getObject(),
        ...data,
      }),
    );
  };

  const getAccountId = () => getObject().session?.accountId;

  const setSession = ({ accountId, refreshToken, token }: any) => {
    setObject({
      session: {
        accountId,
        token,
        refreshToken,
      },
    });
  };

  const getSessionHeaders = () => {
    const { session } = getObject();
    return {
      "account-id": session.accountId,
      token: session.token,
      "refresh-token": session.refreshToken,
    };
  };

  return {
    getAccountId,

    setSession,
    getSessionHeaders,
  };
};

export const STATE = State();
