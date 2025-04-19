import type { IAuth } from "./interface/IAuth";
import type { RequestConfig } from "@/http/types/http";
import { z } from "zod";
import { HttpClient } from "../http/HttpClient";


export abstract class Auth<
   UserType extends object = {},
   CredentialsType extends object = {},
   RegisterDataType extends object = {},
   TokenType extends object = {}
> implements IAuth<UserType, CredentialsType, RegisterDataType, TokenType> {
   protected http: HttpClient;
   protected pathname: string;
   protected userSchema: z.ZodType<UserType>;
   protected credentialsSchema?: z.ZodType<CredentialsType>;
   protected registerDataSchema?: z.ZodType<RegisterDataType>;
   protected tokenSchema?: z.ZodType<TokenType>;

   constructor (
      pathname: string,
      schemas: {
         user: z.ZodType<UserType>;
         credentials?: z.ZodType<CredentialsType>;
         registerData?: z.ZodType<RegisterDataType>;
         tokens?: z.ZodType<TokenType>;
      }
   ) {
      this.http = HttpClient.getInstance();
      this.pathname = pathname;
      this.userSchema = schemas.user;
      this.credentialsSchema = schemas.credentials;
      this.registerDataSchema = schemas.registerData;
      this.tokenSchema = schemas.tokens;
   }

   public async register(
      userData: RegisterDataType,
      options: Partial<RequestConfig> = {}
   ): Promise<UserType> {
      if (this.registerDataSchema) {
         this.registerDataSchema.parse(userData);
      }

      try {
         const response = await this.http.request<{
            user: UserType;
            tokens: TokenType;
         }>({
            method: 'POST',
            url: `${this.pathname}/register`,
            data: userData
         }, options);

         const user = this.userSchema.parse(response.user);
         if (this.tokenSchema) {
            this.tokenSchema.parse(response.tokens);
         }

         return user;
      } catch (error) {
         console.error('Registration error', error);
         throw error;
      }
   }

   public async login(
      credentials: CredentialsType,
      options: Partial<RequestConfig> = {}
   ): Promise<{
      user: UserType;
      tokens: TokenType;
   }> {
      if (this.credentialsSchema) {
         this.credentialsSchema.parse(credentials);
      }

      try {
         const response = await this.http.request<{
            user: UserType;
            tokens: TokenType;
         }>({
            method: 'POST',
            url: `${this.pathname}/login`,
            data: credentials
         }, options);

         const user = this.userSchema.parse(response.user);
         const tokens = this.tokenSchema ? this.tokenSchema.parse(response.tokens) : response.tokens;

         return { user, tokens };
      } catch (error) {
         console.error('Login error', error);
         throw error;
      }
   }

   public async logout(
      options: Partial<RequestConfig> = {}
   ): Promise<void> {
      try {
         await this.http.request({
            method: 'POST',
            url: `${this.pathname}/logout`
         }, options);
      } catch (error) {
         console.error('Logout error', error);
         throw error;
      }
   }

   public async refreshToken(
      refreshToken: string,
      options: Partial<RequestConfig> = {}
   ): Promise<TokenType> {
      try {
         const response = await this.http.request<TokenType>({
            method: 'POST',
            url: `${this.pathname}/refresh-token`,
            data: { refreshToken }
         }, options);

         // Validation du schéma des tokens si défini
         return this.tokenSchema ? this.tokenSchema.parse(response) : response;
      } catch (error) {
         console.error('Token refresh error', error);
         throw error;
      }
   }

   public async getCurrentUser(
      options: Partial<RequestConfig> = {}
   ): Promise<UserType> {
      try {
         const response = await this.http.request<UserType>({
            method: 'GET',
            url: `${this.pathname}/me`
         }, options);

         return this.userSchema.parse(response);
      } catch (error) {
         console.error('Get current user error', error);
         throw error;
      }
   }
};