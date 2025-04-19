import { HttpClient } from '../http/HttpClient.cjs';
import { z } from 'zod';
import { PaginatedSearchRequest, SearchRequest, SearchResponse } from './types/search.cjs';
import { DetailsResponse } from './types/details.cjs';
import { IQuery } from './interface/IQuery.cjs';
import { RequestConfig } from '../http/types/http.cjs';
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
