import { ActionRequest, ActionResponse } from '../interfaces/action';
import { MutateRequest, MutateResponse } from '../interfaces/mutate';
import { SearchRequest, SearchResponse } from '../interfaces/search';
import { HttpService } from './HttpService';
import { AxiosRequestConfig, AxiosError, AxiosInstance } from 'axios';
export declare class ApiServiceError extends Error {
    originalError: AxiosError;
    requestConfig: AxiosRequestConfig;
    constructor(originalError: AxiosError, requestConfig: AxiosRequestConfig);
}
export interface IApiService<T> {
    search(searchRequest: SearchRequest): Promise<SearchResponse<T>>;
    mutate(mutateRequest: MutateRequest[]): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest): Promise<ActionResponse>;
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
    protected request<ResponseType>(config: AxiosRequestConfig, options?: Partial<AxiosRequestConfig>): Promise<ResponseType>;
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
    mutate(mutations: MutateRequest[], options?: Partial<AxiosRequestConfig>): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest, options?: Partial<AxiosRequestConfig>): Promise<ActionResponse>;
    customRequest<ResponseType>(method: string, url: string, data?: T, options?: Partial<AxiosRequestConfig>): Promise<ResponseType>;
    _setAxiosInstanceForTesting(instance: AxiosInstance): void;
}
