import { HttpService } from "./HttpService";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

export class ApiServiceError extends Error {
  constructor(
    public originalError: AxiosError,
    public requestConfig: AxiosRequestConfig,
  ) {
    super("API Service Request Failed");
    this.name = "ApiServiceError";
  }
}

export abstract class ApiService extends HttpService {
  protected readonly DEFAULT_REQUEST_OPTIONS: Partial<AxiosRequestConfig> = {
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

  _setAxiosInstanceForTesting(instance: AxiosInstance): void {
    this.axiosInstance = instance;
  }
}
