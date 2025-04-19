import { HttpConfigOptions, RequestConfig } from "./http.js";
export interface IHttpRequest {
  configure: (options: HttpConfigOptions) => void;
  request: <TResponse = any>(
    config: Partial<RequestConfig> & {
      url: string;
    },
    options?: Partial<RequestConfig>,
  ) => Promise<TResponse>;
}
