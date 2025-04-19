import type { HttpClient } from "../http/HttpClient";
import type { z } from "zod";
import type {
  PaginatedSearchRequest,
  SearchRequest,
  SearchResponse,
} from "@/query/types/search";
import type { DetailsResponse } from "@/query/types/details";
import type { IQuery } from "@/query/interface/IQuery";
import type { RequestConfig } from "@/http/types/http";
import { HttpManager } from "@/http/HttpManager";

export abstract class Query<T> implements IQuery<T> {
  protected http: HttpClient;
  protected pathname: string;
  protected schema: z.ZodType<T>;

  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  ) {
    this.http = HttpManager.getInstance(httpInstanceName);
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

  public async search(
    search: SearchRequest,
    options: Partial<RequestConfig> = {},
  ): Promise<Array<T>> {
    const response = await this.searchRequest(search, options);
    return this.validateData(response.data);
  }

  public async searchPaginate(
    search: PaginatedSearchRequest,
    options: Partial<RequestConfig> = {},
  ): Promise<SearchResponse<T>> {
    const response = await this.searchRequest(search, options);

    return {
      ...response,
      data: this.validateData(response.data),
    };
  }

  public getdetails(
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
