export type ConfigTypes = {
  port: number;
  url: string;
  version: string;
  times: {
    accountTokenDays: number;
    accountRefreshTokenDays: number;
    accountWithoutVerificationDays: number;

    connectionTokenMinutes: number;
  };
  backups: {
    cron: string;
  };
  accounts: {
    maxHotels: number;
  };
  database: {
    filename: string;
  };
  captcha: {
    enabled: boolean;
    url: string;
    id: string;
    token: string;
  };
  email: {
    enabled: boolean;
    hostname: string;
    port: number;
    username: string;
    password: string;
  };
  github: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
  };
};
