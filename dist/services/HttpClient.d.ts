import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpConfigOptions } from '../types/common';
import { IHttpClient } from '../interfaces';
export declare class ApiRequestError extends Error {
    originalError: AxiosError;
    requestConfig: AxiosRequestConfig;
    constructor(originalError: AxiosError, requestConfig: AxiosRequestConfig);
}
export declare class HttpClient implements IHttpClient {
    private static instance?;
    private axiosInstance;
    private maxRetries;
    static init(options: HttpConfigOptions): HttpClient;
    static getInstance(): HttpClient;
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
    protected _setAxiosInstanceForTesting(axiosInstance: AxiosInstance): void;
}
