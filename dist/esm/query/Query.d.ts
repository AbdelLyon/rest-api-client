import { BaseHttp } from "../http/BaseHttp.js";
import { z } from "zod";
import {
  PaginatedSearchRequest,
  SearchRequest,
  SearchResponse,
} from "./types/search.js";
import { DetailsResponse } from "./types/details.js";
import { IQuery } from "./interface/IQuery.js";
import { RequestConfig } from "../http/types/http.js";
export declare abstract class Query<T> implements IQuery<T> {
  protected http: BaseHttp;
  protected pathname: string;
  protected schema: z.ZodType<T>;
  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  );
  private validateData;
  private searchRequest;
  search(
    search: SearchRequest,
    options?: Partial<RequestConfig>,
  ): Promise<Array<T>>;
  searchPaginate(
    search: PaginatedSearchRequest,
    options?: Partial<RequestConfig>,
  ): Promise<SearchResponse<T>>;
  getdetails(options?: Partial<RequestConfig>): Promise<DetailsResponse>;
}
