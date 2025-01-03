import { HttpService } from './HttpService';
import { ActionRequest, MutateRequest, SearchRequest } from '../interfaces';
import { AxiosRequestConfig } from 'axios';
import { SearchResponse } from '../interfaces/search';
import { MutateResponse } from '../interfaces/mutate';
import { ActionResponse } from '../interfaces/action';
export interface IApiService<T> {
    search(searchRequest: SearchRequest): Promise<SearchResponse<T>>;
    mutate(mutateRequest: MutateRequest[]): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest): Promise<ActionResponse>;
}
export declare abstract class ApiService<T> extends HttpService implements IApiService<T> {
    protected baseUrl: string;
    constructor(baseUrl: string);
    protected request<ResponseType>(config: AxiosRequestConfig): Promise<ResponseType>;
    search(search: SearchRequest): Promise<SearchResponse<T>>;
    mutate(mutations: MutateRequest[]): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest): Promise<ActionResponse>;
}
