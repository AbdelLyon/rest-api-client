import { HttpService } from "./HttpService";
import type { ActionRequest, ActionResponse } from "../interfaces/action";
import type { MutateRequest, MutateResponse } from "../interfaces/mutate";
import type { SearchRequest, SearchResponse } from "../interfaces/search";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Définition d'une erreur API personnalisée
export class ApiServiceError extends Error {
  constructor(
    public originalError: AxiosError,
    public requestConfig: AxiosRequestConfig,
  ) {
    super("API Service Request Failed");
    this.name = "ApiServiceError";
  }
}

export interface IApiService<T> {
  search: (searchRequest: SearchRequest) => Promise<SearchResponse<T>>;
  mutate: (
    mutateRequest: Array<MutateRequest<string, string>>,
  ) => Promise<MutateResponse<T>>;
  executeAction: (actionRequest: ActionRequest) => Promise<ActionResponse>;
}

export abstract class ApiService<T>
  extends HttpService
  implements IApiService<T>
{
  private readonly DEFAULT_REQUEST_OPTIONS: Partial<AxiosRequestConfig> = {
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  constructor(protected domain: string, protected pathname: string) {
    super(domain, pathname);
    this.setupApiInterceptors();
  }

  private setupApiInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor,
    );
  }

  private successInterceptor = (response: AxiosResponse): AxiosResponse => {
    return response;
  };

  private errorInterceptor = (error: AxiosError): Promise<never> => {
    this.logError(error);

    throw new ApiServiceError(error, error.config || {});
  };

  private logError(error: AxiosError): void {
    console.error("API Request Error", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  }

  protected async request<TResponse>(
    config: AxiosRequestConfig,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<TResponse> {
    try {
      const mergedConfig = {
        ...this.DEFAULT_REQUEST_OPTIONS,
        ...config,
        ...options,
      };

      const response = await this.axiosInstance.request<TResponse>(
        mergedConfig,
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiServiceError) {
        throw error;
      }
      throw new ApiServiceError(error as AxiosError, config);
    }
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

  public mutate(
    mutations: Array<MutateRequest<string, string>>,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<MutateResponse<T>> {
    return this.request<MutateResponse<T>>(
      {
        method: "POST",
        url: "/mutate",
        data: { mutate: mutations },
      },
      options,
    );
  }

  public executeAction(
    actionRequest: ActionRequest,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<ActionResponse> {
    return this.request<ActionResponse>(
      {
        method: "POST",
        url: `/actions/${actionRequest.action}`,
        data: actionRequest.params,
      },
      options,
    );
  }

  public customRequest<TResponse>(
    method: string,
    url: string,
    data?: T,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<TResponse> {
    return this.request<TResponse>({ method, url, data }, options);
  }

  _setAxiosInstanceForTesting(instance: AxiosInstance): void {
    this.axiosInstance = instance;
  }
}
