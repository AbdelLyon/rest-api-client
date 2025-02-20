import axiosRetry from "axios-retry";
import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import type { IHttpClient } from "@/interfaces";
import type { HttpConfigOptions } from "@/types/common";

export class ApiRequestError extends Error {
  constructor(
    public originalError: AxiosError,
    public requestConfig: AxiosRequestConfig,
  ) {
    super("API Service Request Failed");
    this.name = "ApiRequestError";
  }
}

export class HttpClient implements IHttpClient {
  private static instance?: HttpClient;
  private axiosInstance!: AxiosInstance;
  private maxRetries!: number;

  static init(options: HttpConfigOptions): HttpClient {
    if (!this.instance) {
      this.instance = new HttpClient();
      this.instance.maxRetries = options.maxRetries ?? 3;
      this.instance.axiosInstance = this.instance.createAxiosInstance(options);
      this.instance.setupInterceptors();
      this.instance.configureRetry();
    }
    return this.instance;
  }

  static getInstance(): HttpClient {
    if (!this.instance) {
      throw new Error("Http not initialized. Call Http.init() first.");
    }
    return this.instance;
  }

  protected getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  protected setAxiosInstance(instance: AxiosInstance): void {
    this.axiosInstance = instance;
  }

  protected getFullBaseUrl(options: HttpConfigOptions): string {
    return options.baseURL;
  }

  private createAxiosInstance(options: HttpConfigOptions): AxiosInstance {
    const axiosConfig: AxiosRequestConfig = {
      baseURL: this.getFullBaseUrl(options),
      timeout: options.timeout ?? 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      withCredentials: options.withCredentials ?? true,
    };

    return axios.create(axiosConfig);
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      this.handleErrorResponse.bind(this),
    );
  }

  private configureRetry(): void {
    axiosRetry(this.axiosInstance, {
      retries: this.maxRetries,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: this.isRetryableError,
    });
  }

  private isRetryableError(error: AxiosError): boolean {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 429
    );
  }

  private handleErrorResponse(error: AxiosError): Promise<never> {
    this.logError(error);
    return Promise.reject(new ApiRequestError(error, error.config || {}));
  }

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
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        ...config,
        ...options,
      };

      const response = await this.axiosInstance.request<TResponse>(
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

  protected _setAxiosInstanceForTesting(axiosInstance: AxiosInstance): void {
    this.axiosInstance = axiosInstance;
  }
}
