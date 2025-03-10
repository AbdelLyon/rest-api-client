import { z } from "zod";
import { HttpClient } from "./HttpClient";
import type { AxiosRequestConfig } from "axios";
import type { DetailsResponse, SearchRequest, SearchResponse } from "../types";
import type { IQuery } from "@/interfaces";
import { PaginatedSearchRequest } from "@/types/search";

export abstract class Query<T> implements IQuery<T> {
  protected http: HttpClient;
  protected pathname: string;
  protected schema: z.ZodType<T>;

  constructor(pathname: string, schema: z.ZodType<T>) {
    this.http = HttpClient.getInstance();
    this.pathname = pathname;
    this.schema = schema;
  }

  private validateData(data: unknown[]): T[] {
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
    options: Partial<AxiosRequestConfig> = {},
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
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<Array<T>> {
    const response = await this.searchRequest(search, options);
    return this.validateData(response.data);
  }

  public async searchPaginate(
    search: PaginatedSearchRequest,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<SearchResponse<T>> {
    const response = await this.searchRequest(search, options);

    return {
      ...response,
      data: this.validateData(response.data),
    };
  }

  public getdetails(
    options: Partial<AxiosRequestConfig> = {},
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
