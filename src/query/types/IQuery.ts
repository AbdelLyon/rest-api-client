import type {
  PaginatedSearchRequest,
  SearchRequest,
} from "@/query/types/search";
import type { DetailsResponse } from "@/query/types/details";
import type { RequestConfig } from "@/http/types/http";

export interface IQuery<T> {
  search: <TResponse = Array<T>>(
    search: SearchRequest | PaginatedSearchRequest,
    options: Partial<RequestConfig>,
  ) => Promise<TResponse>;

  details: (options?: Partial<RequestConfig>) => Promise<DetailsResponse>;
}
