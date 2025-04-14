import type { SearchRequest, SearchResponse } from "@/types/search";
import type { RequestConfig } from "@/types/common";
import type { DetailsResponse } from "@/types/details";

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
