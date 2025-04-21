import { ConfigOptions, IHttpRequest, RequestConfig } from "../types.js";
export declare class HttpRequest implements IHttpRequest {
  private baseURL;
  private defaultTimeout;
  private defaultHeaders;
  private withCredentials;
  private maxRetries;
  private handler;
  constructor();
  configure(options: ConfigOptions): void;
  request<TResponse>(
    config: Partial<RequestConfig> & {
      url: string;
    },
    options?: Partial<RequestConfig>,
  ): Promise<TResponse>;
  private createMergedConfig;
  private buildRequestUrl;
  private handleReqError;
}
