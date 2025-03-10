import axiosRetry from "axios-retry";
import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import type { IHttpClient } from "@/interfaces";
import type { HttpConfigOptions } from "@/types/common";
import { ApiRequestError } from "./ApiRequestError";

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
    // Vérifier si l'URL de base est fournie
    if (!options.baseURL) {
      throw new Error("baseURL is required in HttpConfigOptions");
    }

    // Normaliser l'URL de base (s'assurer qu'elle n'a pas de / à la fin)
    let baseUrl = options.baseURL.trim();
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    // Ajouter un préfixe d'API si nécessaire
    if (options.apiPrefix) {
      // S'assurer que le préfixe est correctement formaté
      let prefix = options.apiPrefix.trim();
      if (!prefix.startsWith("/")) {
        prefix = "/" + prefix;
      }
      if (prefix.endsWith("/")) {
        prefix = prefix.slice(0, -1);
      }

      return baseUrl + prefix;
    }

    // Ajouter un préfixe de version si nécessaire
    if (options.apiVersion) {
      return `${baseUrl}/v${options.apiVersion}`;
    }

    return baseUrl;
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
      retryCondition: this.isRetryableError.bind(this),
    });
  }

  // Rendons cette méthode non-privée pour faciliter les tests
  // Vous pouvez aussi la laisser privée et utiliser des techniques d'accès via l'indexation dans les tests
  protected isRetryableError(error: AxiosError): boolean {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 429
    );
  }

  private handleErrorResponse(error: AxiosError): Promise<never> {
    this.logError(error);
    return Promise.reject(new ApiRequestError(error, error.config || {}));
  }

  // Rendons cette méthode non-privée pour faciliter les tests
  protected logError(error: AxiosError): void {
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

  static resetInstance(): void {
    if (this.instance) {
      this.instance = undefined;
    }
  }
}
