import { HttpService } from "./HttpService";
import { ActionRequest, MutateRequest, SearchRequest } from "@/interfaces";

import { injectable } from "inversify";
import { AxiosRequestConfig } from "axios";
import "reflect-metadata";
import { SearchResponse } from "@/interfaces/Search";
import { MutateResponse } from "@/interfaces/Mutate";
import { ActionResponse } from "@/interfaces/Action";

export interface IApiService<T> {
  search(params: SearchRequest): Promise<SearchResponse<T>>;
  mutate(mutations: MutateRequest[]): Promise<MutateResponse<T>>;
  executeAction(action: string, params: ActionRequest): Promise<ActionResponse>;
}

export
@injectable()
class ApiService<T> extends HttpService implements IApiService<T> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  protected async request<ResponseType>(
    config: AxiosRequestConfig,
  ): Promise<ResponseType> {
    try {
      const response = await this.axiosInstance(config);
      return response.data;
    } catch (error) {
      console.error(
        `API Request failed: ${config.method} ${config.url}`,
        error,
      );
      throw error;
    }
  }

  public async search(params: SearchRequest): Promise<SearchResponse<T>> {
    return this.request<SearchResponse<T>>({
      method: "POST",
      url: "/search",
      data: { search: params },
    });
  }

  public async mutate(mutations: MutateRequest[]): Promise<MutateResponse<T>> {
    return this.request<MutateResponse<T>>({
      method: "POST",
      url: "/mutate",
      data: { mutate: mutations },
    });
  }

  public async executeAction(
    action: string,
    params: ActionRequest,
  ): Promise<ActionResponse> {
    return this.request<ActionResponse>({
      method: "POST",
      url: `/actions/${action}`,
      data: params,
    });
  }
}
