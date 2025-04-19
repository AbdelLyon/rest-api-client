import type { IAuth } from "./interface/IAuth";
import type { RequestConfig } from "@/http/types/http";
import type { z } from "zod";
import type { BaseHttp } from "@/http";
import { HttpCLient } from "@/http/HttpClient";

export abstract class Auth<
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

  // Optionnellement utiliser un nom d'instance spécifique
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
  ) {
    this.pathname = pathname;
    this.userSchema = schemas.user;
    this.credentialsSchema = schemas.credentials;
    this.registerDataSchema = schemas.registerData;
    this.tokenSchema = schemas.tokens;
    this.httpInstanceName = httpInstanceName;

    this.initHttpClient();
    this.http = HttpCLient.getInstance(this.httpInstanceName);
  }

  private initHttpClient(): void {
    this.http = HttpCLient.getInstance(this.httpInstanceName);
  }

  public async register(
    userData: TRegisterData,
    options: Partial<RequestConfig> = {},
  ): Promise<TUser> {
    if (this.registerDataSchema) {
      this.registerDataSchema.parse(userData);
    }

    try {
      const response = await this.http.request<{
        user: TUser;
        tokens: TTokens;
      }>(
        {
          method: "POST",
          url: `${this.pathname}/register`,
          data: userData,
        },
        options,
      );

      const user = this.userSchema.parse(response.user);
      if (this.tokenSchema) {
        this.tokenSchema.parse(response.tokens);
      }

      return user;
    } catch (error) {
      console.error("Registration error", error);
      throw error;
    }
  }

  public async login(
    credentials: TCredentials,
    options: Partial<RequestConfig> = {},
  ): Promise<{
    user: TUser;
    tokens: TTokens;
  }> {
    if (this.credentialsSchema) {
      this.credentialsSchema.parse(credentials);
    }

    try {
      const response = await this.http.request<{
        user: TUser;
        tokens: TTokens;
      }>(
        {
          method: "POST",
          url: `${this.pathname}/login`,
          data: credentials,
        },
        options,
      );

      const user = this.userSchema.parse(response.user);
      const tokens = this.tokenSchema
        ? this.tokenSchema.parse(response.tokens)
        : response.tokens;

      return { user, tokens };
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  }

  public async logout(options: Partial<RequestConfig> = {}): Promise<void> {
    try {
      await this.http.request(
        {
          method: "POST",
          url: `${this.pathname}/logout`,
        },
        options,
      );
    } catch (error) {
      console.error("Logout error", error);
      throw error;
    }
  }

  public async refreshToken(
    refreshToken: string,
    options: Partial<RequestConfig> = {},
  ): Promise<TTokens> {
    try {
      const response = await this.http.request<TTokens>(
        {
          method: "POST",
          url: `${this.pathname}/refresh-token`,
          data: { refreshToken },
        },
        options,
      );

      return this.tokenSchema ? this.tokenSchema.parse(response) : response;
    } catch (error) {
      console.error("Token refresh error", error);
      throw error;
    }
  }

  public async getCurrentUser(
    options: Partial<RequestConfig> = {},
  ): Promise<TUser> {
    try {
      const response = await this.http.request<TUser>(
        {
          method: "GET",
          url: `${this.pathname}/me`,
        },
        options,
      );

      return this.userSchema.parse(response);
    } catch (error) {
      console.error("Get current user error", error);
      throw error;
    }
  }
}
