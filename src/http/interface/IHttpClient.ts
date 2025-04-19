import type { RequestConfig } from "@/http/types/http";

export interface IHttpClient {
  request: <TResponse>(
    config: RequestConfig,
    options?: Partial<RequestConfig>,
  ) => Promise<TResponse>;

}