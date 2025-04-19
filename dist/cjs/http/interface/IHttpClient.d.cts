import { RequestConfig } from '../types/http.cjs';
export interface IHttpClient {
    request: <TResponse>(config: RequestConfig, options?: Partial<RequestConfig>) => Promise<TResponse>;
}
