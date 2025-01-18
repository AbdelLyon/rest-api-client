import { AxiosRequestConfig } from 'axios';
export interface IHttpClient {
    request: <TResponse>(config: AxiosRequestConfig, options?: Partial<AxiosRequestConfig>) => Promise<TResponse>;
}
