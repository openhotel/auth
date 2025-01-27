export type DbAccount = {
  accountId: string;
  username: string;

  emailHash: string;
  passwordHash: string;

  languages: string[];

  verified: boolean;

  createdAt: number;
  updatedAt: number;

  githubLogin?: string;
};

export type AccountCreation = {
  email: string;
  username: string;
  password: string;
  languages: string[];
};
