import type { HttpRequest } from "../http/Request/HttpRequest";
import type {
  DetailsResponse,
  IQuery,
  PaginatedSearchRequest,
  SearchRequest,
  SearchResponse,
} from "./types";
import type { z } from "zod";
import type { RequestConfig } from "@/http/types";
import { HttpClient } from "@/http/HttpClient";

export abstract class Query<T> implements IQuery<T> {
  protected http: HttpRequest;
  protected pathname: string;
  protected schema: z.ZodType<T>;

  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  ) {
    this.http = HttpClient.getInstance(httpInstanceName);
    this.pathname = pathname;
    this.schema = schema;
  }

  private validateData(data: Array<unknown>): Array<T> {
    return data.map((item) => {
      const result = this.schema.safeParse(item);
      if (!result.success) {
        console.error("Type validation failed:", result.error.errors);
        throw new Error(
          `Type validation failed: ${JSON.stringify(result.error.errors)}`,
        );
      }
      return result.data;
    });
  }

  private searchRequest(
    search: SearchRequest,
    options: Partial<RequestConfig> = {},
  ): Promise<SearchResponse<T>> {
    return this.http.request<SearchResponse<T>>(
      {
        method: "POST",
        url: `${this.pathname}/search`,
        data: { search },
      },
      options,
    );
  }

  public async search<TResponse = Array<T>>(
    search: SearchRequest | PaginatedSearchRequest,
    options: Partial<RequestConfig> = {},
  ): Promise<TResponse> {
    const response = await this.searchRequest(search, options);
    const validatedData = this.validateData(response.data);

    const isPaginated = "page" in search || "limit" in search;

    if (isPaginated) {
      return {
        ...response,
        data: validatedData,
      } as TResponse;
    }
    return validatedData as TResponse;
  }

  public details(
    options: Partial<RequestConfig> = {},
  ): Promise<DetailsResponse> {
    return this.http.request<DetailsResponse>(
      {
        method: "GET",
        url: this.pathname,
      },
      options,
    );
  }
}
