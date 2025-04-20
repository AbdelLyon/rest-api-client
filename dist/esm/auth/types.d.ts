import { RequestConfig } from "../http/types.js";
export interface IAuth<
  TUser extends object = {},
  TCredentials extends object = {},
  TRegisterData extends object = {},
  TToken extends object = {},
> {
  register: (
    userData: TRegisterData,
    options?: Partial<RequestConfig>,
  ) => Promise<TUser>;
  login: (
    credentials: TCredentials,
    options?: Partial<RequestConfig>,
  ) => Promise<{
    user: TUser;
    tokens: TToken;
  }>;
  logout: (options?: Partial<RequestConfig>) => Promise<void>;
  refreshToken: (
    refreshToken: string,
    options?: Partial<RequestConfig>,
  ) => Promise<TToken>;
  getCurrentUser: (options?: Partial<RequestConfig>) => Promise<TUser>;
}
