import { z } from "zod";
import { HttpClient } from "./HttpClient";
import type { RequestConfig } from "@/types/common";
import type { IAuth } from "@/interfaces/IAuth";


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

   /**
    * Inscription
    */
   public async register(
      userData: RegisterDataType,
      options: Partial<RequestConfig> = {}
   ): Promise<UserType> {
      // Validation des données d'inscription si un schéma est défini
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

         // Validation du schéma de réponse
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

   /**
    * Connexion
    */
   public async login(
      credentials: CredentialsType,
      options: Partial<RequestConfig> = {}
   ): Promise<{
      user: UserType;
      tokens: TokenType;
   }> {
      // Validation des credentials si un schéma est défini
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

         // Validation des schémas
         const user = this.userSchema.parse(response.user);
         const tokens = this.tokenSchema ? this.tokenSchema.parse(response.tokens) : response.tokens;

         return { user, tokens };
      } catch (error) {
         console.error('Login error', error);
         throw error;
      }
   }

   /**
    * Déconnexion
    */
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

   /**
    * Rafraîchissement du token
    */
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

   /**
    * Récupération de l'utilisateur courant
    */
   public async getCurrentUser(
      options: Partial<RequestConfig> = {}
   ): Promise<UserType> {
      try {
         const response = await this.http.request<UserType>({
            method: 'GET',
            url: `${this.pathname}/me`
         }, options);

         // Validation du schéma de l'utilisateur
         return this.userSchema.parse(response);
      } catch (error) {
         console.error('Get current user error', error);
         throw error;
      }
   }
};