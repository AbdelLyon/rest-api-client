import { SearchResponse } from "@/interfaces";
import { PaginationParams } from "@/interfaces/common";
import {
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";

export function useInfiniteRequest<TReq extends PaginationParams, TRes>({
  queryKey,
  requestFn,
  initialRequest,
  options = {},
}: {
  queryKey: QueryKey[];
  requestFn: (request: TReq) => Promise<SearchResponse<TRes>>;
  initialRequest: TReq;

  options?: Omit<
    UseInfiniteQueryOptions<
      SearchResponse<TRes>,
      Error,
      SearchResponse<TRes>,
      SearchResponse<TRes>,
      typeof queryKey,
      TReq
    >,
    "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
  >;
}) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = initialRequest }) => requestFn(pageParam as TReq),
    initialPageParam: initialRequest,
    getNextPageParam: (lastPage, _, lastPageParam: TReq) => {
      if (
        !lastPage.meta ||
        lastPage.data.length < (lastPage.meta.perPage || 10)
      ) {
        return undefined;
      }
      return {
        ...lastPageParam,
        page: (lastPageParam.page || 1) + 1,
      } as TReq;
    },
    ...options,
  });
}
