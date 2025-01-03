import { AxiosInstance } from 'axios';
export declare abstract class HttpService {
    protected baseUrl: string;
    protected axiosInstance: AxiosInstance;
    private isRefreshing;
    private refreshTokenPromise;
    private readonly MAX_RETRIES;
    constructor(baseUrl: string);
    private createInstance;
    private setupInterceptors;
    private addAuthorizationHeader;
    private handleResponseError;
    private handleTokenRefresh;
    private refreshToken;
    protected updateTokens(tokens: {
        access_token: string;
        refresh_token?: string;
    }): void;
    protected clearTokens(): void;
    private handleAuthenticationFailure;
    private initializeRetry;
}
