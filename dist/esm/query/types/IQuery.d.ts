import { SearchRequest, SearchResponse } from "./search.js";
import { DetailsResponse } from "./details.js";
import { RequestConfig } from "../../http/types/http.js";
export interface IQuery<T> {
  search: (
    searchRequest: SearchRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<Array<T>>;
  searchPaginate: (
    searchRequest: SearchRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<SearchResponse<T>>;
  getdetails: (options?: Partial<RequestConfig>) => Promise<DetailsResponse>;
}
