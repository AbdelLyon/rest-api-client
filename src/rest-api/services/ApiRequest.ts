import "reflect-metadata";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type { IApiRequest, IHttpConfig } from "./inerfaces";
import { Inject, Injectable } from "@/rest-api/di/decorators";
import { TOKENS } from "@/rest-api/di/tokens";
import { Container } from "@/rest-api/di/Container";

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
export class ApiRequestService implements IApiRequest {
  protected readonly DEFAULT_REQUEST_OPTIONS: Partial<AxiosRequestConfig> = {
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  constructor(
    @Inject(TOKENS.IHttpConfig) private readonly httpConfig: IHttpConfig,
  ) {
    if (this.httpConfig === null) {
      this.setupApiInterceptors();
    }
  }

  private setupApiInterceptors(): void {
    const axiosInstance = this.httpConfig.getAxiosInstance();
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

      const response = await this.httpConfig
        .getAxiosInstance()
        .request<TResponse>(mergedConfig);
      return response.data;
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }
      throw new ApiRequestError(error as AxiosError, config);
    }
  }
}

Container.bind<IApiRequest>(TOKENS.IApiRequest).to(ApiRequestService);
