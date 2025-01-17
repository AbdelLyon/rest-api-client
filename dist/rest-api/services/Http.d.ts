import { AxiosError, AxiosRequestConfig } from 'axios';
import { HttpConfig } from './HttpConfig';
import { IHttp } from './inerfaces';
export declare class ApiRequestError extends Error {
    originalError: AxiosError;
    requestConfig: AxiosRequestConfig;
    constructor(originalError: AxiosError, requestConfig: AxiosRequestConfig);
}
export declare class Http extends HttpConfig implements IHttp {
    protected readonly DEFAULT_REQUEST_OPTIONS: Partial<AxiosRequestConfig>;
    constructor(domain: string, baseUrl: string);
    private setupApiInterceptors;
    private successInterceptor;
    private errorInterceptor;
    private logError;
    request<TResponse>(config: AxiosRequestConfig, options?: Partial<AxiosRequestConfig>): Promise<TResponse>;
}
