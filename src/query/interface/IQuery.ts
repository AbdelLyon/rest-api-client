import type { SearchRequest, SearchResponse } from "@/query/types/search";
import type { DetailsResponse } from "@/query/types/details";
import { RequestConfig } from "@/http/types/http";

export interface IQuery<T> {
  search: (
    searchRequest: SearchRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<Array<T>>;
  searchPaginate: (
    searchRequest: SearchRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<SearchResponse<T>>;
  getdetails: (
    options?: Partial<RequestConfig>,
  ) => Promise<DetailsResponse>;
}
