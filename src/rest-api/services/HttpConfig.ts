import "reflect-metadata";
import axiosRetry from "axios-retry";
import axios from "axios";
import type { IHttpConfig } from "./inerfaces";
import type { AxiosError, AxiosInstance } from "axios";

export abstract class HttpConfig implements IHttpConfig {
  private axiosInstance: AxiosInstance;
  private readonly MAX_RETRIES = 3;

  constructor(
    private readonly domain: string,
    private readonly baseUrl: string,
  ) {
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
    this.configureRetry();
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  public setAxiosInstance(instance: AxiosInstance): void {
    this.axiosInstance = instance;
  }

  public getFullBaseUrl(): string {
    return `https://local-${this.domain}-api.xefi-apps.fr/api/${this.baseUrl}`;
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.getFullBaseUrl(),
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    });
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
      retries: this.MAX_RETRIES,
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
    return Promise.reject(error);
  }
}
