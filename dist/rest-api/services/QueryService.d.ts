import { ApiService } from './ApiService';
import { SearchRequest, SearchResponse } from '../interfaces/search';
import { AxiosRequestConfig } from 'axios';
export interface IQueryService<T> {
    search: (searchRequest: SearchRequest) => Promise<Array<T>>;
    searchPaginate: (searchRequest: SearchRequest) => Promise<SearchResponse<T>>;
}
export declare class QueryService<T> extends ApiService implements IQueryService<T> {
    protected constructor(domain: string, pathname: string);
    private searchRequest;
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<Array<T>>;
    searchPaginate(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
}
