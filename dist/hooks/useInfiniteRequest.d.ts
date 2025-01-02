import { SearchResponse } from '../interfaces';
import { PaginationParams } from '../interfaces/common';
import { QueryKey, UseInfiniteQueryOptions } from '@tanstack/react-query';
export declare function useInfiniteRequest<TReq extends PaginationParams, TRes>({ queryKey, requestFn, initialRequest, options, }: {
    queryKey: QueryKey[];
    requestFn: (request: TReq) => Promise<SearchResponse<TRes>>;
    initialRequest: TReq;
    options?: Omit<UseInfiniteQueryOptions<SearchResponse<TRes>, Error, SearchResponse<TRes>, SearchResponse<TRes>, typeof queryKey, TReq>, "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">;
}): import('@tanstack/react-query').UseInfiniteQueryResult<SearchResponse<TRes>, Error>;
