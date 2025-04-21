import { HttpRequest } from "../http/Request/HttpRequest.js";
import {
  DetailsResponse,
  IQuery,
  PaginatedSearchRequest,
  SearchRequest,
} from "./types.js";
import { z } from "zod";
import { RequestConfig } from "../http/types.js";
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
