import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SearchRequest } from '../interfaces/SearchRequest';
import { ActionRequest } from '../interfaces/ActionRequest';
import { MutateRequest } from '../interfaces';
interface SearchResponse<T> {
    data: T[];
    meta?: {
        page: number;
        perPage: number;
        total: number;
    };
}
interface MutateResponse<T> {
    data: T[];
}
interface ActionResponse {
    success: boolean;
    data?: any;
}
interface ServiceConfiguration {
    pathname: string;
    baseDevUrl?: string;
    baseProdUrl?: string;
}
export declare abstract class BaseService<T> {
    protected axiosInstance: AxiosInstance;
    protected baseDevUrl: string;
    protected baseProdUrl: string;
    protected pathname: string;
    private isRefreshing;
    private refreshTokenPromise;
    private readonly MAX_RETRIES;
    constructor({ pathname, baseDevUrl, baseProdUrl, }: ServiceConfiguration);
    private createAxiosInstance;
    private getBaseApiUrl;
    private setupInterceptors;
    private addAuthorizationHeader;
    private handleResponseError;
    private handleTokenRefresh;
    private refreshToken;
    private updateTokens;
    clearTokens(): void;
    private handleAuthenticationFailure;
    private initializeRetry;
    protected request<ResponseType>(config: AxiosRequestConfig): Promise<ResponseType>;
    search(params: SearchRequest): Promise<SearchResponse<T>>;
    mutate(mutations: MutateRequest[]): Promise<MutateResponse<T>>;
    executeAction(action: string, params: ActionRequest): Promise<ActionResponse>;
}
export {};
