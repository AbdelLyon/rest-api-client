import { IHttpClient } from "./interface/IHttpClient.js";
import { HttpConfigOptions, RequestConfig } from "./types/http.js";
export declare class HttpClient implements IHttpClient {
  private baseURL;
  private defaultTimeout;
  private defaultHeaders;
  private withCredentials;
  private maxRetries;
  constructor();
  configure(options: HttpConfigOptions): void;
  request<TResponse = any>(
    config: Partial<RequestConfig> & {
      url: string;
    },
    options?: Partial<RequestConfig>,
  ): Promise<TResponse>;
}
