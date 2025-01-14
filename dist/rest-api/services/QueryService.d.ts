import { ApiService } from './ApiService';
import { DetailsResponse } from '../interfaces/details';
import { SearchRequest, SearchResponse } from '../interfaces/search';
import { AxiosRequestConfig } from 'axios';
export interface IQueryService<T> {
    search: (searchRequest: SearchRequest) => Promise<Array<T>>;
    searchPaginate: (searchRequest: SearchRequest) => Promise<SearchResponse<T>>;
    getdetails: () => Promise<DetailsResponse>;
}
export declare class QueryService<T> extends ApiService implements IQueryService<T> {
    protected constructor(domain: string, pathname: string);
    private searchRequest;
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<Array<T>>;
    searchPaginate(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
    getdetails(options?: Partial<AxiosRequestConfig>): Promise<DetailsResponse>;
}
