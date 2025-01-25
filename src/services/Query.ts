import { HttpClient } from "./HttpClient";
import type { AxiosRequestConfig } from "axios";
import type { DetailsResponse, SearchRequest, SearchResponse } from "../types";
import type { IQuery } from "@/interfaces";
import { PaginatedSearchRequest } from "@/types/search";

export abstract class Query<T> implements IQuery<T> {
  protected http: HttpClient;
  protected pathname: string;

  constructor(pathname: string) {
    this.http = HttpClient.getInstance();
    this.pathname = pathname;
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
    return response.data;
  }

  public searchPaginate(
    search: PaginatedSearchRequest,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<SearchResponse<T>> {
    return this.searchRequest(search, options);
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
