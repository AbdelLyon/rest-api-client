import { HttpService } from "./HttpService";
import { ActionRequest, MutateRequest, SearchRequest } from "@/interfaces";
import { AxiosRequestConfig } from "axios";
import { SearchResponse } from "@/interfaces/search";
import { MutateResponse } from "@/interfaces/mutate";
import { ActionResponse } from "@/interfaces/action";

export interface IApiService<T> {
  search(searchRequest: SearchRequest): Promise<SearchResponse<T>>;
  mutate(mutateRequest: MutateRequest[]): Promise<MutateResponse<T>>;
  executeAction(actionRequest: ActionRequest): Promise<ActionResponse>;
}

export class ApiService<T> extends HttpService implements IApiService<T> {
  private static instances: Map<string, ApiService<any>> = new Map();

  private constructor(baseUrl: string) {
    super(baseUrl);
  }

  public static getInstance<T>(baseUrl: string): ApiService<T> {
    if (!this.instances.has(baseUrl)) {
      this.instances.set(baseUrl, new ApiService<T>(baseUrl));
    }
    return this.instances.get(baseUrl) as ApiService<T>;
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

  public async search(search: SearchRequest): Promise<SearchResponse<T>> {
    return this.request<SearchResponse<T>>({
      method: "POST",
      url: "/search",
      data: { search },
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
    actionRequest: ActionRequest,
  ): Promise<ActionResponse> {
    return this.request<ActionResponse>({
      method: "POST",
      url: `/actions/${actionRequest.action}`,
      data: actionRequest.params,
    });
  }
}
