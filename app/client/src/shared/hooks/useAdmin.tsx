import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApi } from "shared/hooks/useApi";
import { useAccount } from "shared/hooks/useAccount";
import { PrivateHotel, Token, User } from "shared/types";
import { RequestMethod } from "shared/enums";

type AdminState = {
  users: User[];
  tokens: Token[];
  hotels: PrivateHotel[];

  addToken: (label: string) => Promise<string>;
  removeToken: (id: string) => Promise<void>;

  update: () => Promise<void>;

  updateUser: (user: User) => Promise<void>;
  deleteUser: (user: User) => Promise<void>;
  resendVerificationUser: (accountId: string) => Promise<void>;

  refresh: () => void;
};

const AdminContext = React.createContext<AdminState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const AdminProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const [users, setUsers] = useState<User[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [hotels, setHotels] = useState<PrivateHotel[]>([]);

  const fetchUsers = useCallback(async () => {
    return fetch({
      method: RequestMethod.GET,
      pathname: "/admin/users",
      headers: getAccountHeaders(),
    });
  }, [fetch, getAccountHeaders]);

  const updateUser = useCallback(
    (user: User) => {
      return fetch({
        method: RequestMethod.PATCH,
        pathname: "/admin/user",
        headers: getAccountHeaders(),
        body: user,
      });
    },
    [fetch, getAccountHeaders],
  );

  const deleteUser = useCallback(
    (user: User) => {
      return fetch({
        method: RequestMethod.DELETE,
        pathname: "/admin/user",
        headers: getAccountHeaders(),
        body: user,
      });
    },
    [fetch, getAccountHeaders],
  );

  const resendVerificationUser = useCallback(
    (accountId: string) => {
      return fetch({
        method: RequestMethod.POST,
        pathname: "/admin/user/resendVerification",
        headers: getAccountHeaders(),
        body: { accountId },
      });
    },
    [fetch, getAccountHeaders],
  );

  const fetchTokens = useCallback(async () => {
    return fetch({
      method: RequestMethod.GET,
      pathname: "/admin/tokens",
      headers: getAccountHeaders(),
    });
  }, [fetch, getAccountHeaders]);

  const addToken = useCallback(
    async (label: string): Promise<string> => {
      const { id, token } = (
        await fetch({
          method: RequestMethod.POST,
          pathname: "/admin/tokens",
          headers: getAccountHeaders(),
          body: {
            label,
          },
        })
      ).data;
      setTokens((tokens) => [
        ...tokens,
        {
          id,
          label,
        },
      ]);
      return token;
    },
    [fetch, getAccountHeaders, setTokens],
  );

  const removeToken = useCallback(
    async (id: string): Promise<void> => {
      await fetch({
        method: RequestMethod.DELETE,
        pathname: `/admin/tokens?id=${id}`,
        headers: getAccountHeaders(),
      });
      setTokens((tokens) => tokens.filter((token) => token.id !== id));
    },
    [fetch, getAccountHeaders, setTokens],
  );

  const fetchHotels = useCallback(async () => {
    return fetch({
      method: RequestMethod.GET,
      pathname: "/admin/hotels",
      headers: getAccountHeaders(),
    });
  }, [fetch, getAccountHeaders]);

  const update = useCallback(() => {
    return fetch({
      method: RequestMethod.PATCH,
      pathname: "/admin/update",
      headers: getAccountHeaders(),
    });
  }, []);

  const refresh = useCallback(() => {
    fetchUsers().then((response) => setUsers(response.data.users));
    fetchTokens().then((response) => setTokens(response.data.tokens));
    fetchHotels().then((response) => setHotels(response.data.hotels));
  }, [fetchUsers, fetchTokens, fetchHotels, setUsers, setTokens, setHotels]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AdminContext.Provider
      value={{
        users,
        updateUser,
        deleteUser,
        resendVerificationUser,

        tokens,
        hotels,

        addToken,
        removeToken,
        update,

        refresh,
      }}
      children={children}
    />
  );
};

export const useAdmin = (): AdminState => useContext(AdminContext);
