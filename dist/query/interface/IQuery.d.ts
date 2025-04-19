import { SearchRequest, SearchResponse } from '../types/search';
import { DetailsResponse } from '../types/details';
import { RequestConfig } from '../../http/types/http';
export interface IQuery<T> {
    search: (searchRequest: SearchRequest, options?: Partial<RequestConfig>) => Promise<Array<T>>;
    searchPaginate: (searchRequest: SearchRequest, options?: Partial<RequestConfig>) => Promise<SearchResponse<T>>;
    getdetails: (options?: Partial<RequestConfig>) => Promise<DetailsResponse>;
}
