import { QueryKey, UseSuspenseInfiniteQueryOptions, UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';
import { SearchResponse } from '../interfaces/search';
import { PaginationParams } from '../interfaces/common';
export type SuspenseInfiniteQueryOptions<TReq, TRes> = Omit<UseSuspenseInfiniteQueryOptions<SearchResponse<TRes>, Error, SearchResponse<TRes>, SearchResponse<TRes>, QueryKey, TReq>, "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">;
export interface UseSuespenseInfiniteRequestParams<TReq extends PaginationParams, TRes> {
    queryKey: QueryKey;
    requestFn: (request: TReq) => Promise<SearchResponse<TRes>>;
    initialRequest: TReq;
    options?: SuspenseInfiniteQueryOptions<TReq, TRes>;
}
export declare function useSuspenseInfiniteSearch<TReq extends PaginationParams, TRes>({ queryKey, requestFn, initialRequest, options, }: UseSuespenseInfiniteRequestParams<TReq, TRes>): UseSuspenseInfiniteQueryResult<SearchResponse<TRes>, Error>;
