import { HttpRequest } from '../http/request/HttpRequest.js';
import { DetailsResponse, IQuery, PaginatedSearchRequest, SearchRequest, ComparisonOperator } from './types.js';
import { z } from 'zod';
import { SearchBuilder } from './SearchBuilder.js';
import { DetailsBuilder } from './DetailsBuilder.js';
type ExtractKeys<T> = keyof T & string;
type ValueForField<T, K extends keyof T> = T[K] extends Array<infer U> ? U | U[] : T[K] extends (infer V)[] ? V | V[] : T[K];
export declare abstract class Query<T> implements IQuery<T> {
    protected http: HttpRequest;
    protected pathname: string;
    protected schema: z.ZodType<T>;
    constructor(pathname: string, schema: z.ZodType<T>, httpInstanceName?: string);
    private validateData;
    private searchRequest;
    search<TResponse = Array<T>>(search: SearchRequest | PaginatedSearchRequest): Promise<TResponse>;
    createSearchBuilder<U extends T = T>(): SearchBuilder<U>;
    executeSearch<TResponse = Array<T>>(builder: SearchBuilder<T>): Promise<TResponse>;
    searchByText<TResponse = Array<T>>(text: string, page?: number, limit?: number): Promise<TResponse>;
    searchByField<K extends ExtractKeys<T>, TResponse = Array<T>>(field: K, operator: ComparisonOperator, value: ValueForField<T, K>): Promise<TResponse>;
    createDetailsBuilder<U extends T = T>(): DetailsBuilder<U>;
    details(): Promise<DetailsResponse>;
}
export {};
