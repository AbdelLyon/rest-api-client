import "reflect-metadata";
import { AxiosRequestConfig } from "axios";
import { SearchRequest, SearchResponse } from "../types/search";
import { DetailsResponse } from "../types/details";
import type { IApiRequest, IQuery } from "./inerfaces";
import { Inject, Injectable } from "@/rest-api/di/decorators";
import { TOKENS } from "@/rest-api/di/tokens";

@Injectable()
export class Query<T> implements IQuery<T> {
  constructor(
    @Inject(TOKENS.IApiRequest) private readonly apiRequest: IApiRequest,
  ) {
    if (this.apiRequest !== undefined) {
      throw new Error("ApiRequest is required");
    }
  }

  private searchRequest(
    search: SearchRequest,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<SearchResponse<T>> {
    return this.apiRequest.request<SearchResponse<T>>(
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
    return this.apiRequest.request<DetailsResponse>(
      {
        method: "GET",
        url: "",
      },
      options,
    );
  }
}
