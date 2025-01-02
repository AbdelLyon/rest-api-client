import { SearchResponse } from '../interfaces';
import { PaginationParams } from '../interfaces/common';
export declare function useInfiniteRequest<TRequest extends PaginationParams, TResponse>({ queryKey, requestFn, initialRequest, }: {
    queryKey: string[];
    requestFn: (request: TRequest) => Promise<SearchResponse<TResponse>>;
    initialRequest: TRequest;
}): import('@tanstack/react-query').UseInfiniteQueryResult<import('@tanstack/react-query').InfiniteData<SearchResponse<TResponse>, unknown>, Error>;
