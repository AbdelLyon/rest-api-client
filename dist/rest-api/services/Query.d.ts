import { Http } from './Http';
import { AxiosRequestConfig } from 'axios';
import { SearchRequest, SearchResponse } from '../types/search';
import { DetailsResponse } from '../types/details';
import { IQuery } from './inerfaces';
export declare class Query<T> extends Http implements IQuery<T> {
    private searchRequest;
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<Array<T>>;
    searchPaginate(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
    getdetails(options?: Partial<AxiosRequestConfig>, pathname?: string): Promise<DetailsResponse>;
}
