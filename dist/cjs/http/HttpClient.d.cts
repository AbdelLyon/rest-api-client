import { HttpConfig, RequestConfig } from './types/http.cjs';
import { IHttpClient } from './interface/IHttpClient.cjs';
export declare class HttpClient implements IHttpClient {
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
    static getAvailableInstances(): Array<string>;
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
