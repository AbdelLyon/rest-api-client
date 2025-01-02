import { SearchResponse } from "@/interfaces";
import { PaginationParams } from "@/interfaces/common";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteRequest<
  TRequest extends PaginationParams,
  TResponse,
>({
  queryKey,
  requestFn,
  initialRequest,
}: {
  queryKey: string[];
  requestFn: (request: TRequest) => Promise<SearchResponse<TResponse>>;
  initialRequest: TRequest;
}) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = initialRequest }) =>
      requestFn(pageParam as TRequest),
    initialPageParam: initialRequest,
    getNextPageParam: (lastPage, _, lastPageParam: TRequest) => {
      if (
        !lastPage.meta ||
        lastPage.data.length < (lastPage.meta.perPage || 10)
      ) {
        return undefined;
      }
      return {
        ...lastPageParam,
        page: (lastPageParam.page || 1) + 1,
      } as TRequest;
    },
  });
}
