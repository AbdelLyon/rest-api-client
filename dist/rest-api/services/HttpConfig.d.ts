import { AxiosInstance } from 'axios';
import { IHttpConfig } from './inerfaces';
export declare class HttpConfig implements IHttpConfig {
    private readonly domain;
    private readonly baseUrl;
    private axiosInstance;
    private readonly MAX_RETRIES;
    constructor(domain: string, baseUrl: string);
    getAxiosInstance(): AxiosInstance;
    setAxiosInstance(instance: AxiosInstance): void;
    getFullBaseUrl(): string;
    private createAxiosInstance;
    private setupInterceptors;
    private configureRetry;
    private isRetryableError;
    private handleErrorResponse;
}
