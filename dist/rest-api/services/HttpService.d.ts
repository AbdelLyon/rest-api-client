import { AxiosInstance } from 'axios';
export declare abstract class HttpService {
    protected axiosInstance: AxiosInstance;
    protected readonly domain: string;
    protected readonly baseUrl: string;
    protected readonly MAX_RETRIES = 3;
    constructor(domain: string, baseUrl: string);
    private createAxiosInstance;
    protected getFullBaseUrl(): string;
    private setupInterceptors;
    private configureRetry;
    private isRetryableError;
    private handleErrorResponse;
    protected setAxiosInstance(instance: AxiosInstance): void;
}
