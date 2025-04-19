import { RequestConfig } from "../types/http.js";
export interface IBaseHttp {
  request: <TResponse>(
    config: RequestConfig,
    options?: Partial<RequestConfig>,
  ) => Promise<TResponse>;
}
