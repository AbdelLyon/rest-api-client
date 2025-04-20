import {
  DetailsResponse,
  IQuery,
  PaginatedSearchRequest,
  SearchRequest,
} from "./types.js";
import { z } from "zod";
import { RequestConfig } from "../http/types.js";
import { Request } from "../http/Request/Request.js";
export declare abstract class Query<T> implements IQuery<T> {
  protected http: Request;
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
