import { IAuth } from "./interface/IAuth.js";
import { RequestConfig } from "../http/types/http.js";
import { z } from "zod";
import { BaseHttp } from "../http/shared/BaseHttp.js";
export declare abstract class Auth<
  TUser extends object = {},
  TCredentials extends object = {},
  TRegisterData extends object = {},
  TTokens extends object = {},
> implements IAuth<TUser, TCredentials, TRegisterData, TTokens>
{
  protected http: BaseHttp;
  protected pathname: string;
  protected userSchema: z.ZodType<TUser>;
  protected credentialsSchema?: z.ZodType<TCredentials>;
  protected registerDataSchema?: z.ZodType<TRegisterData>;
  protected tokenSchema?: z.ZodType<TTokens>;
  protected httpInstanceName?: string;
  constructor(
    pathname: string,
    schemas: {
      user: z.ZodType<TUser>;
      credentials?: z.ZodType<TCredentials>;
      registerData?: z.ZodType<TRegisterData>;
      tokens?: z.ZodType<TTokens>;
    },
    httpInstanceName?: string,
  );
  private initHttpClient;
  register(
    userData: TRegisterData,
    options?: Partial<RequestConfig>,
  ): Promise<TUser>;
  login(
    credentials: TCredentials,
    options?: Partial<RequestConfig>,
  ): Promise<{
    user: TUser;
    tokens: TTokens;
  }>;
  logout(options?: Partial<RequestConfig>): Promise<void>;
  refreshToken(
    refreshToken: string,
    options?: Partial<RequestConfig>,
  ): Promise<TTokens>;
  getCurrentUser(options?: Partial<RequestConfig>): Promise<TUser>;
}
