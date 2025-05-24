import { RequestConfig } from '../http.js';
import { SearchRequest, PaginatedSearchRequest, ScopeParameterValue, ComparisonOperator, LogicalOperator, SortDirection, AggregationFunction, SearchPermission, Filter, FilterCriteria, SortCriteria, FieldSelection, InstructionField, IQuery } from './types.js';
type ExtractKeys<T> = keyof T & string;
type ExtractRelationKeys<T> = {
    [K in keyof T]: T[K] extends Array<infer _> ? K & string : T[K] extends object ? K & string : never;
}[keyof T] & string;
type ValueType<T, K extends keyof T> = T[K] extends Array<infer U> ? U | U[] : T[K] extends (infer V)[] ? V | V[] : T[K];
export declare class SearchBuilder<T> {
    private searchRequest;
    private queryInstance?;
    withText(value: string): this;
    withScope(name: string, parameters?: Array<ScopeParameterValue>): this;
    withFilter<K extends ExtractKeys<T>>(field: K, operator: ComparisonOperator, value: ValueType<T, K>, type?: LogicalOperator): this;
    withNestedFilters(filters: Array<FilterCriteria>): this;
    withSort<K extends ExtractKeys<T>>(field: K, direction?: SortDirection): this;
    withSelect<K extends ExtractKeys<T>>(field: K): this;
    withInclude<K extends ExtractRelationKeys<T>>(relation: K, options?: {
        filters?: Array<Filter>;
        sorts?: Array<SortCriteria>;
        selects?: Array<FieldSelection>;
        scopes?: Array<{
            name: string;
            parameters: Array<ScopeParameterValue>;
        }>;
        limit?: number;
    }): this;
    withAggregate<K extends ExtractRelationKeys<T>>(relation: K, type: AggregationFunction, field?: string, filters?: Array<Filter>): this;
    withInstruction(name: string, fields: Array<InstructionField>): this;
    withGate(permission: SearchPermission): this;
    withPagination(page: number, limit: number): this;
    search<TResponse = Array<T>>(options?: Partial<RequestConfig>): Promise<TResponse>;
    build(): SearchRequest | PaginatedSearchRequest;
    setQueryInstance(instance: IQuery<T>): IQuery<T>;
}
export {};
