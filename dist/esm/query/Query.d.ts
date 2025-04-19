import { z } from "zod";
import { PaginatedSearchRequest, SearchRequest } from "./types/search.js";
import { DetailsResponse } from "./types/details.js";
import { IQuery } from "./types/IQuery.js";
import { RequestConfig } from "../http/types/http.js";
import { HttpRequest } from "../http/common/HttpRequest.js";
export declare abstract class Query<T> implements IQuery<T> {
  protected http: HttpRequest;
  protected pathname: string;
  protected schema: z.ZodType<T>;
  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  );
  private validateData;
  private searchRequest;
  search<TResponse = Array<T>>(
    search: SearchRequest | PaginatedSearchRequest,
    options?: Partial<RequestConfig>,
  ): Promise<TResponse>;
  details(options?: Partial<RequestConfig>): Promise<DetailsResponse>;
}
