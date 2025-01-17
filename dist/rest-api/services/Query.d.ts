import { AxiosRequestConfig } from 'axios';
import { SearchRequest, SearchResponse } from '../types/search';
import { DetailsResponse } from '../types/details';
import { IHttp, IQuery } from './inerfaces';
export declare class Query<T> implements IQuery<T> {
    private readonly apiRequest;
    constructor(apiRequest: IHttp);
    private searchRequest;
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<Array<T>>;
    searchPaginate(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
    getdetails(options?: Partial<AxiosRequestConfig>): Promise<DetailsResponse>;
}
