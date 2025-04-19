import { z } from 'zod';

export declare abstract class Auth<UserType extends object = {}, CredentialsType extends object = {}, RegisterDataType extends object = {}, TokenType extends object = {}> implements IAuth<UserType, CredentialsType, RegisterDataType, TokenType> {
    protected http: HttpClient;
    protected pathname: string;
    protected userSchema: z.ZodType<UserType>;
    protected credentialsSchema?: z.ZodType<CredentialsType>;
    protected registerDataSchema?: z.ZodType<RegisterDataType>;
    protected tokenSchema?: z.ZodType<TokenType>;
    constructor(pathname: string, schemas: {
        user: z.ZodType<UserType>;
        credentials?: z.ZodType<CredentialsType>;
        registerData?: z.ZodType<RegisterDataType>;
        tokens?: z.ZodType<TokenType>;
    });
    register(userData: RegisterDataType, options?: Partial<RequestConfig>): Promise<UserType>;
    login(credentials: CredentialsType, options?: Partial<RequestConfig>): Promise<{
        user: UserType;
        tokens: TokenType;
    }>;
    logout(options?: Partial<RequestConfig>): Promise<void>;
    refreshToken(refreshToken: string, options?: Partial<RequestConfig>): Promise<TokenType>;
    getCurrentUser(options?: Partial<RequestConfig>): Promise<UserType>;
}

declare class HttpClient implements IHttpClient {
    private static instances;
    private static defaultInstanceName;
    private static requestInterceptors;
    private static responseSuccessInterceptors;
    private static responseErrorInterceptors;
    private baseURL;
    private defaultTimeout;
    private defaultHeaders;
    private withCredentials;
    private maxRetries;
    private constructor();
    static init(config: {
        httpConfig: HttpConfig;
        instanceName: string;
    }): HttpClient;
    static getInstance(instanceName?: string): HttpClient;
    static setDefaultInstance(instanceName: string): void;
    static getAvailableInstances(): string[];
    static resetInstance(instanceName?: string): void;
    private configure;
    private getFullBaseUrl;
    private setupDefaultInterceptors;
    private logError;
    private applyRequestInterceptors;
    private applyResponseSuccessInterceptors;
    private applyResponseErrorInterceptors;
    private isRetryableError;
    private fetchWithRetry;
    request<TResponse = any>(config: Partial<RequestConfig> & {
        url: string;
    }, options?: Partial<RequestConfig>): Promise<TResponse>;
}

declare interface HttpConfig extends HttpConfigOptions {
    interceptors?: {
        request?: RequestInterceptor[];
        response?: {
            success?: ResponseSuccessInterceptor[];
            error?: ResponseErrorInterceptor[];
        };
    };
}

declare interface HttpConfigOptions {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    withCredentials?: boolean;
    maxRetries?: number;
    apiPrefix?: string;
    apiVersion?: string | number;
}

export declare interface IAuth<UserType extends object = {}, CredentialsType extends object = {}, RegisterDataType extends object = {}, TokenType extends object = {}> {
    register(userData: RegisterDataType, options?: Partial<RequestConfig>): Promise<UserType>;
    login(credentials: CredentialsType, options?: Partial<RequestConfig>): Promise<{
        user: UserType;
        tokens: TokenType;
    }>;
    logout(options?: Partial<RequestConfig>): Promise<void>;
    refreshToken(refreshToken: string, options?: Partial<RequestConfig>): Promise<TokenType>;
    getCurrentUser(options?: Partial<RequestConfig>): Promise<UserType>;
}

declare interface IHttpClient {
    request: <TResponse>(config: RequestConfig, options?: Partial<RequestConfig>) => Promise<TResponse>;
}

declare interface RequestConfig extends RequestInit {
    url: string;
    params?: Record<string, string>;
    data?: any;
    timeout?: number;
    baseURL?: string;
    headers?: Record<string, string>;
}

declare type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;

declare type ResponseErrorInterceptor = (error: any) => Promise<any>;

declare type ResponseSuccessInterceptor = (response: Response) => Promise<Response> | Response;

export { }
