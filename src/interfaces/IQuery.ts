import { RequestConfig } from "@/types/common";
import type { DetailsResponse, SearchRequest, SearchResponse } from "../types";

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
