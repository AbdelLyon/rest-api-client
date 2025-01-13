import { useInfiniteRequest } from './useInfinitSearch';
import { QueryKey } from '@tanstack/react-query';
import { SearchRequest } from '../interfaces';
type UseSearch = {
    queryKey: QueryKey;
    domaine: string;
    pathname: string;
    search: SearchRequest;
    initialRequest: SearchRequest;
};
export declare const useInfinitSearchUser: ({ domaine, pathname, search, queryKey, initialRequest, }: UseSearch) => ReturnType<typeof useInfiniteRequest>;
export {};
