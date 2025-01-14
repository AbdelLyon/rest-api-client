import { HttpService } from './HttpService';
import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
export declare class ApiServiceError extends Error {
    originalError: AxiosError;
    requestConfig: AxiosRequestConfig;
    constructor(originalError: AxiosError, requestConfig: AxiosRequestConfig);
}
export declare abstract class ApiService extends HttpService {
    protected domain: string;
    protected pathname: string;
    protected readonly DEFAULT_REQUEST_OPTIONS: Partial<AxiosRequestConfig>;
    constructor(domain: string, pathname: string);
    private setupApiInterceptors;
    private successInterceptor;
    private errorInterceptor;
    private logError;
    protected request<TResponse>(config: AxiosRequestConfig, options?: Partial<AxiosRequestConfig>): Promise<TResponse>;
    _setAxiosInstanceForTesting(instance: AxiosInstance): void;
}
