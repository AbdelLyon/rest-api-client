import type { RequestConfig } from "@/http/types/http";

export interface IBaseHttp {
  request: <TResponse>(
    config: RequestConfig,
    options?: Partial<RequestConfig>,
  ) => Promise<TResponse>;
}
