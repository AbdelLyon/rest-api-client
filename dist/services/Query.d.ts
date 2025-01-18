import { HttpClient } from './HttpClient';
import { AxiosRequestConfig } from 'axios';
import { DetailsResponse, SearchRequest, SearchResponse } from '../types';
import { IQuery } from '../interfaces';
export declare abstract class Query<T> implements IQuery<T> {
    protected http: HttpClient;
    protected pathname: string;
    constructor(pathname: string);
    private searchRequest;
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<Array<T>>;
    searchPaginate(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
    getdetails(options?: Partial<AxiosRequestConfig>): Promise<DetailsResponse>;
}
