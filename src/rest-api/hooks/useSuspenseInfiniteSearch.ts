import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import type {
  QueryKey,
  UseSuspenseInfiniteQueryOptions,
  UseSuspenseInfiniteQueryResult,
} from "@tanstack/react-query";
import type { SearchResponse } from "../interfaces/search";
import type { PaginationParams } from "../interfaces/common";

export type SuspenseInfiniteQueryOptions<TReq, TRes> = Omit<
  UseSuspenseInfiniteQueryOptions<
    SearchResponse<TRes>,
    Error,
    SearchResponse<TRes>,
    SearchResponse<TRes>,
    QueryKey,
    TReq
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export interface UseSuespenseInfiniteRequestParams<
  TReq extends PaginationParams,
  TRes,
> {
  queryKey: QueryKey;
  requestFn: (request: TReq) => Promise<SearchResponse<TRes>>;
  initialRequest: TReq;
  options?: SuspenseInfiniteQueryOptions<TReq, TRes>;
}

export function useSuspenseInfiniteSearch<TReq extends PaginationParams, TRes>({
  queryKey,
  requestFn,
  initialRequest,
  options,
}: UseSuespenseInfiniteRequestParams<
  TReq,
  TRes
>): UseSuspenseInfiniteQueryResult<SearchResponse<TRes>, Error> {
  return useSuspenseInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      return requestFn(pageParam as TReq);
    },
    initialPageParam: initialRequest,
    getNextPageParam: (lastPage, _, lastPageParam: TReq) => {
      const perPage = lastPage.meta?.perPage ?? 10;
      const currentPage = lastPageParam.page ?? 1;

      if (lastPage.data.length < perPage) {
        return undefined;
      }

      return {
        ...lastPageParam,
        page: currentPage + 1,
      } as TReq;
    },
    ...options,
  });
}
