import { HandlerConfig, RequestConfig } from '../types.js';
export declare class HttpHandler {
    private readonly idempotentMethods;
    private maxRetries;
    private defaultTimeout;
    private withCredentials;
    configure(config: HandlerConfig): void;
    executeRequest(url: string, config: RequestConfig): Promise<Response>;
    parseResponse<T>(response: Response): Promise<T>;
    private fetchWithRetry;
    private performFetch;
    private prepareRequestBody;
    private appendQueryParams;
    private isRetryableError;
    private shouldRetry;
    private retryWithBackoff;
}
