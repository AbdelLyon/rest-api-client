import { SearchRequest, SearchResponse } from '../types/search.cjs';
import { DetailsResponse } from '../types/details.cjs';
import { RequestConfig } from '../../http/types/http.cjs';
export interface IQuery<T> {
    search: (searchRequest: SearchRequest, options?: Partial<RequestConfig>) => Promise<Array<T>>;
    searchPaginate: (searchRequest: SearchRequest, options?: Partial<RequestConfig>) => Promise<SearchResponse<T>>;
    getdetails: (options?: Partial<RequestConfig>) => Promise<DetailsResponse>;
}
