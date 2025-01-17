import { AxiosError, AxiosRequestConfig } from 'axios';
import { IApiRequest, IHttpConfig } from './inerfaces';
export declare class ApiRequestError extends Error {
    originalError: AxiosError;
    requestConfig: AxiosRequestConfig;
    constructor(originalError: AxiosError, requestConfig: AxiosRequestConfig);
}
export declare class ApiRequestService implements IApiRequest {
    private readonly httpConfig;
    protected readonly DEFAULT_REQUEST_OPTIONS: Partial<AxiosRequestConfig>;
    constructor(httpConfig: IHttpConfig);
    private setupApiInterceptors;
    private successInterceptor;
    private errorInterceptor;
    private logError;
    request<TResponse>(config: AxiosRequestConfig, options?: Partial<AxiosRequestConfig>): Promise<TResponse>;
}
