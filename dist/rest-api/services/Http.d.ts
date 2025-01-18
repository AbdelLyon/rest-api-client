import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
export declare class ApiRequestError extends Error {
    originalError: AxiosError;
    requestConfig: AxiosRequestConfig;
    constructor(originalError: AxiosError, requestConfig: AxiosRequestConfig);
}
export interface HttpConfigOptions {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    withCredentials?: boolean;
    maxRetries?: number;
}
export declare class Http {
    private axiosInstance;
    private readonly MAX_RETRIES;
    constructor(options: HttpConfigOptions);
    protected getAxiosInstance(): AxiosInstance;
    protected setAxiosInstance(instance: AxiosInstance): void;
    protected getFullBaseUrl(options: HttpConfigOptions): string;
    private createAxiosInstance;
    private setupInterceptors;
    private configureRetry;
    private isRetryableError;
    private handleErrorResponse;
    private logError;
    request<TResponse>(config: AxiosRequestConfig, options?: Partial<AxiosRequestConfig>): Promise<TResponse>;
}
