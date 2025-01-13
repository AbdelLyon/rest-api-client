// HttpService.ts
import axios from "axios";
import axiosRetry from "axios-retry";
import type { AxiosError, AxiosInstance } from "axios";

export abstract class HttpService {
  protected axiosInstance: AxiosInstance;
  protected readonly domain: string;
  protected readonly baseUrl: string;
  protected readonly MAX_RETRIES = 3;

  constructor(domain: string, baseUrl: string) {
    this.domain = domain;
    this.baseUrl = baseUrl;
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
    this.configureRetry();
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

  protected getFullBaseUrl(): string {
    return `https://local-${this.domain}-api.xefi-apps.fr/api/${this.baseUrl}`;
  }

  private setupInterceptors(): void {
    // Ajouter des intercepteurs si nécessaire
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

  protected setAxiosInstance(instance: AxiosInstance): void {
    this.axiosInstance = instance;
  }
}
