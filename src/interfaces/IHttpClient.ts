import { RequestConfig } from "@/types/common";


export interface IHttpClient {
  request: <TResponse>(
    config: RequestConfig,
    options?: Partial<RequestConfig>,
  ) => Promise<TResponse>;

}