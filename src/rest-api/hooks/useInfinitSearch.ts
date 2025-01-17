import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationParams } from "../types/common";
import type { SearchResponse } from "../types/search";
import type {
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

export type InfiniteQueryOptions<TReq, TRes> = Omit<
  UseInfiniteQueryOptions<
    SearchResponse<TRes>,
    Error,
    SearchResponse<TRes>,
    SearchResponse<TRes>,
    QueryKey,
    TReq
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export interface UseInfiniteRequestParams<TReq extends PaginationParams, TRes> {
  queryKey: QueryKey;
  requestFn: (request: TReq) => Promise<SearchResponse<TRes>>;
  initialRequest: TReq;
  options?: UseInfiniteRequestParams<TReq, TRes>;
}

export function useInfiniteSearch<TReq extends PaginationParams, TRes>({
  queryKey,
  requestFn,
  initialRequest,
  options,
}: UseInfiniteRequestParams<TReq, TRes>): UseInfiniteQueryResult<
  SearchResponse<TRes>,
  Error
> {
  return useInfiniteQuery({
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
