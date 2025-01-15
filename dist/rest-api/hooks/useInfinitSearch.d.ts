import { QueryKey, UseInfiniteQueryOptions, UseInfiniteQueryResult } from '@tanstack/react-query';
import { SearchResponse } from '../interfaces/search';
import { PaginationParams } from '../interfaces/common';
export type InfiniteQueryOptions<TReq, TRes> = Omit<UseInfiniteQueryOptions<SearchResponse<TRes>, Error, SearchResponse<TRes>, SearchResponse<TRes>, QueryKey, TReq>, "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">;
export interface UseInfiniteRequestParams<TReq extends PaginationParams, TRes> {
    queryKey: QueryKey;
    requestFn: (request: TReq) => Promise<SearchResponse<TRes>>;
    initialRequest: TReq;
    options?: UseInfiniteRequestParams<TReq, TRes>;
}
export declare function useInfiniteSearch<TReq extends PaginationParams, TRes>({ queryKey, requestFn, initialRequest, options, }: UseInfiniteRequestParams<TReq, TRes>): UseInfiniteQueryResult<SearchResponse<TRes>, Error>;
