import { ApiService } from "./ApiService";
import type { DetailsResponse } from "../interfaces/details";
import type { SearchRequest, SearchResponse } from "../interfaces/search";
import type { AxiosRequestConfig } from "axios";

export interface IQueryService<T> {
  search: (searchRequest: SearchRequest) => Promise<Array<T>>;
  searchPaginate: (searchRequest: SearchRequest) => Promise<SearchResponse<T>>;
  getdetails: () => Promise<DetailsResponse>;
}

export class QueryService<T> extends ApiService implements IQueryService<T> {
  protected constructor(domain: string, pathname: string) {
    super(domain, pathname);
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
