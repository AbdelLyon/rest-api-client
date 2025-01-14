import { ApiService } from './ApiService';
import { SearchRequest, SearchResponse } from '../interfaces/search';
import { AxiosRequestConfig } from 'axios';
export interface IQueryService<T> {
    search: (searchRequest: SearchRequest) => Promise<SearchResponse<T>>;
}
export declare class QueryService<T> extends ApiService implements IQueryService<T> {
    protected constructor(domain: string, pathname: string);
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
}
