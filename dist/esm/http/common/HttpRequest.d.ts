import { HttpConfigOptions, IHttpRequest, RequestConfig } from "../types.js";
export declare class HttpRequest implements IHttpRequest {
  private baseURL;
  private defaultTimeout;
  private defaultHeaders;
  private withCredentials;
  private maxRetries;
  configure(options: HttpConfigOptions): void;
  request<TResponse = any>(
    config: Partial<RequestConfig> & {
      url: string;
    },
    options?: Partial<RequestConfig>,
  ): Promise<TResponse>;
  private createMergedConfig;
  private buildRequestUrl;
  private applyRequestInterceptors;
  private executeRequest;
  private parseResponse;
  private handleRequestError;
  private isRetryableError;
  private fetchWithRetry;
  private performFetch;
  private appendQueryParams;
  private prepareRequestBody;
  private shouldRetry;
  private retryWithBackoff;
}
