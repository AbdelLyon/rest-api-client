import { Http } from './Http';
import { AxiosRequestConfig } from 'axios';
import { DetailsResponse, SearchRequest, SearchResponse } from '../types';
export declare abstract class Query<T> {
    protected http: Http;
    protected pathname: string;
    constructor(pathname: string);
    private searchRequest;
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<Array<T>>;
    searchPaginate(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
    getdetails(options?: Partial<AxiosRequestConfig>): Promise<DetailsResponse>;
}
