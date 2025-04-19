import { PaginatedSearchRequest, SearchRequest } from "./search.js";
import { DetailsResponse } from "./details.js";
import { RequestConfig } from "../../http/types/http.js";
export interface IQuery<T> {
  search: <TResponse = Array<T>>(
    search: SearchRequest | PaginatedSearchRequest,
    options: Partial<RequestConfig>,
  ) => Promise<TResponse>;
  details: (options?: Partial<RequestConfig>) => Promise<DetailsResponse>;
}
