import { HttpService } from './HttpService';
import { ActionRequest, MutateRequest, SearchRequest } from '../interfaces';
import { AxiosRequestConfig } from 'axios';
import { SearchResponse } from '../interfaces/Search';
import { MutateResponse } from '../interfaces/Mutate';
import { ActionResponse } from '../interfaces/Action';
export interface IApiService<T> {
    search(searchRequest: SearchRequest): Promise<SearchResponse<T>>;
    mutate(mutateRequest: MutateRequest[]): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest): Promise<ActionResponse>;
}
export declare class ApiService<T> extends HttpService implements IApiService<T> {
    constructor(baseUrl: string);
    protected request<ResponseType>(config: AxiosRequestConfig): Promise<ResponseType>;
    search(params: SearchRequest): Promise<SearchResponse<T>>;
    mutate(mutations: MutateRequest[]): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest): Promise<ActionResponse>;
}
