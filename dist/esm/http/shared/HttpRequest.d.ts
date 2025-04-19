import { RequestConfig } from "../types/http.js";
export declare class HttpRequest {
  static isRetryableError(status: number, method?: string): boolean;
  static fetchWithRetry(
    url: string,
    config: RequestConfig,
    maxRetries: number,
    defaultTimeout: number,
    withCredentials: boolean,
    attempt?: number,
  ): Promise<Response>;
}
