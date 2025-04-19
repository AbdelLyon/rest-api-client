import { SearchRequest, SearchResponse, PaginatedSearchRequest } from './types/search';
import { DetailsResponse } from './types/details';
import { IQuery } from './interface/IQuery';
import { RequestConfig } from '../http/types/http';
import { z } from 'zod';
import { HttpClient } from '../http/HttpClient';
export declare abstract class Query<T> implements IQuery<T> {
    protected http: HttpClient;
    protected pathname: string;
    protected schema: z.ZodType<T>;
    constructor(pathname: string, schema: z.ZodType<T>);
    private validateData;
    private searchRequest;
    search(search: SearchRequest, options?: Partial<RequestConfig>): Promise<Array<T>>;
    searchPaginate(search: PaginatedSearchRequest, options?: Partial<RequestConfig>): Promise<SearchResponse<T>>;
    getdetails(options?: Partial<RequestConfig>): Promise<DetailsResponse>;
}
