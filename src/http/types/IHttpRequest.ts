import type { HttpConfigOptions, RequestConfig } from "@/http/types/http";

export interface IHttpRequest {
  configure: (options: HttpConfigOptions) => void;

  request: <TResponse = any>(
    config: Partial<RequestConfig> & { url: string },
    options?: Partial<RequestConfig>,
  ) => Promise<TResponse>;
}
