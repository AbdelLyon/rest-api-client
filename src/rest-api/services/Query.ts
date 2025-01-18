import "reflect-metadata";
import { Http } from "./Http";
import type { AxiosRequestConfig } from "axios";
import type { SearchRequest, SearchResponse } from "../types/search";
import type { DetailsResponse } from "../types/details";
import type { IQuery } from "./inerfaces";

export class Query<T> extends Http implements IQuery<T> {
  constructor(pathname: string) {
    super({
      baseURL: `/${pathname}`,
    });
  }

  private searchRequest(
    search: SearchRequest,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<SearchResponse<T>> {
    return this.request<SearchResponse<T>>(
      {
        method: "POST",
        url: "/search",
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
    search: SearchRequest,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<SearchResponse<T>> {
    return this.searchRequest(search, options);
  }

  public getdetails(
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<DetailsResponse> {
    return this.request<DetailsResponse>(
      {
        method: "GET",
        url: "",
      },
      options,
    );
  }
}
