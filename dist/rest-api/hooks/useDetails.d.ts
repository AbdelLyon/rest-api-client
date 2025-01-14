import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { DetailsResponse } from '../interfaces/details';
interface UseDetailsParams<TRes> {
    queryKey: Array<string>;
    requestFn: () => Promise<DetailsResponse>;
    options?: UseDetailsOptions<TRes>;
}
export type UseDetailsOptions<TRes> = Omit<UseQueryOptions<DetailsResponse, Error, TRes>, "queryKey" | "queryFn">;
export declare function useDetails<TRes = DetailsResponse>({ queryKey, requestFn, options, }: UseDetailsParams<TRes>): UseQueryResult<TRes, Error>;
export {};
