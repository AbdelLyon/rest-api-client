import { HttpRequest } from '../http/request/HttpRequest.js';
import { IAuth } from './types.js';
import { z } from 'zod';
export declare abstract class Auth<TUser, TCredentials, TRegisterData, TTokens> implements IAuth<TUser, TCredentials, TRegisterData, TTokens> {
    protected http: HttpRequest;
    protected pathname: string;
    protected userSchema: z.ZodType<TUser>;
    protected credentialsSchema?: z.ZodType<TCredentials>;
    protected registerDataSchema?: z.ZodType<TRegisterData>;
    protected tokenSchema?: z.ZodType<TTokens>;
    protected httpInstanceName?: string;
    constructor(pathname: string, schemas: {
        user: z.ZodType<TUser>;
        credentials?: z.ZodType<TCredentials>;
        registerData?: z.ZodType<TRegisterData>;
        tokens?: z.ZodType<TTokens>;
    }, httpInstanceName?: string);
    private initHttpClient;
    register(userData: TRegisterData): Promise<TUser>;
    login(credentials: TCredentials): Promise<{
        user: TUser;
        tokens: TTokens;
    }>;
    logout(): Promise<void>;
    refreshToken(refreshToken: string): Promise<TTokens>;
    getCurrentUser(): Promise<TUser>;
}
