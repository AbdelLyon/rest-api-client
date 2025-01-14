// QueryService.ts
import { ApiService } from "./ApiService";
import type { SearchRequest, SearchResponse } from "../interfaces/search";
import type { AxiosRequestConfig } from "axios";

export interface IQueryService<T> {
  search: (searchRequest: SearchRequest) => Promise<SearchResponse<T>>;
}

export class QueryService<T> extends ApiService implements IQueryService<T> {
  protected constructor(domain: string, pathname: string) {
    super(domain, pathname);
  }

  public search(
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
}
