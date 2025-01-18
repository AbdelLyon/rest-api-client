import type { AxiosRequestConfig } from "axios";
import type { DetailsResponse, SearchRequest, SearchResponse } from "../types";

export interface IQuery<T> {
  search: (
    searchRequest: SearchRequest,
    options?: Partial<AxiosRequestConfig>,
  ) => Promise<Array<T>>;
  searchPaginate: (
    searchRequest: SearchRequest,
    options?: Partial<AxiosRequestConfig>,
  ) => Promise<SearchResponse<T>>;
  getdetails: (
    options?: Partial<AxiosRequestConfig>,
  ) => Promise<DetailsResponse>;
}
