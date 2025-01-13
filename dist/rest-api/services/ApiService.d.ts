import { HttpService } from './HttpService';
import { ActionRequest, ActionResponse } from '../interfaces/action';
import { MutateRequest, MutateResponse } from '../interfaces/mutate';
import { SearchRequest, SearchResponse } from '../interfaces/search';
import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
export declare class ApiServiceError extends Error {
    originalError: AxiosError;
    requestConfig: AxiosRequestConfig;
    constructor(originalError: AxiosError, requestConfig: AxiosRequestConfig);
}
export interface IApiService<T> {
    search: (searchRequest: SearchRequest) => Promise<SearchResponse<T>>;
    mutate: (mutateRequest: Array<MutateRequest<string, string>>) => Promise<MutateResponse<T>>;
    executeAction: (actionRequest: ActionRequest) => Promise<ActionResponse>;
}
export declare abstract class ApiService<T> extends HttpService implements IApiService<T> {
    protected domain: string;
    protected pathname: string;
    private readonly DEFAULT_REQUEST_OPTIONS;
    constructor(domain: string, pathname: string);
    private setupApiInterceptors;
    private successInterceptor;
    private errorInterceptor;
    private logError;
    protected request<TResponse>(config: AxiosRequestConfig, options?: Partial<AxiosRequestConfig>): Promise<TResponse>;
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
    mutate(mutations: Array<MutateRequest<string, string>>, options?: Partial<AxiosRequestConfig>): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest, options?: Partial<AxiosRequestConfig>): Promise<ActionResponse>;
    customRequest<TResponse>(method: string, url: string, data?: T, options?: Partial<AxiosRequestConfig>): Promise<TResponse>;
    _setAxiosInstanceForTesting(instance: AxiosInstance): void;
}
