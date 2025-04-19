import { RequestConfig } from '../types/http.js';
export interface IHttpClient {
    request: <TResponse>(config: RequestConfig, options?: Partial<RequestConfig>) => Promise<TResponse>;
}
