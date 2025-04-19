import { IBaseHttp } from "../interface/IBaseHttp.js";
import { HttpConfigOptions, RequestConfig } from "../types/http.js";
export declare class BaseHttp implements IBaseHttp {
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
