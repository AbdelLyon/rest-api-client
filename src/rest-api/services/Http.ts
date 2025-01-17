import "reflect-metadata";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { HttpConfig } from "./HttpConfig";
import type { IHttp } from "./inerfaces";
import { Injectable } from "@/rest-api/di/decorators";

export class ApiRequestError extends Error {
  constructor(
    public originalError: AxiosError,
    public requestConfig: AxiosRequestConfig,
  ) {
    super("API Service Request Failed");
    this.name = "ApiRequestError";
  }
}

@Injectable()
export class Http extends HttpConfig implements IHttp {
  protected readonly DEFAULT_REQUEST_OPTIONS: Partial<AxiosRequestConfig> = {
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  constructor(domain: string, baseUrl: string) {
    super(domain, baseUrl);
    this.setupApiInterceptors();
  }

  private setupApiInterceptors(): void {
    const axiosInstance = this.getAxiosInstance();
    axiosInstance.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor,
    );
  }

  private successInterceptor = (response: AxiosResponse): AxiosResponse => {
    return response;
  };

  private errorInterceptor = (error: AxiosError): Promise<never> => {
    this.logError(error);
    throw new ApiRequestError(error, error.config || {});
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

  public async request<TResponse>(
    config: AxiosRequestConfig,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<TResponse> {
    try {
      const mergedConfig = {
        ...this.DEFAULT_REQUEST_OPTIONS,
        ...config,
        ...options,
      };

      const response = await this.getAxiosInstance().request<TResponse>(
        mergedConfig,
      );
      return response.data;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }
      throw new ApiRequestError(error as AxiosError, config);
    }
  }
}
