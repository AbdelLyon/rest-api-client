import axiosRetry from "axios-retry";
import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import type { IHttpClient } from "@/interfaces";
import type { HttpConfigOptions } from "@/types/common";
import { ApiRequestError } from "./ApiRequestError";

export class HttpClient implements IHttpClient {
  private static instances: Map<string, HttpClient> = new Map();
  private static defaultInstanceName: string = "default";
  private axiosInstance!: AxiosInstance;
  private maxRetries!: number;

  static init(
    options: HttpConfigOptions,
    instanceName: string = "default",
  ): HttpClient {
    if (!this.instances.has(instanceName)) {
      const instance = new HttpClient();
      instance.maxRetries = options.maxRetries ?? 3;
      instance.axiosInstance = instance.createAxiosInstance(options);
      instance.setupInterceptors();
      instance.configureRetry();
      this.instances.set(instanceName, instance);

      // Si c'est la première instance, la définir comme instance par défaut
      if (this.instances.size === 1) {
        this.defaultInstanceName = instanceName;
      }
    }
    return this.instances.get(instanceName)!;
  }

  static getInstance(instanceName?: string): HttpClient {
    const name = instanceName || this.defaultInstanceName;

    if (!this.instances.has(name)) {
      throw new Error(
        `Http instance '${name}' not initialized. Call Http.init() first.`,
      );
    }
    return this.instances.get(name)!;
  }

  static setDefaultInstance(instanceName: string): void {
    if (!this.instances.has(instanceName)) {
      throw new Error(
        `Cannot set default: Http instance '${instanceName}' not initialized.`,
      );
    }
    this.defaultInstanceName = instanceName;
  }

  static getAvailableInstances(): string[] {
    return Array.from(this.instances.keys());
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

  static resetInstance(instanceName?: string): void {
    if (instanceName) {
      this.instances.delete(instanceName);

      // Si l'instance par défaut a été supprimée, réinitialiser
      if (
        instanceName === this.defaultInstanceName &&
        this.instances.size > 0
      ) {
        this.defaultInstanceName =
          this.instances.keys().next().value ?? "default";
      }
    } else {
      // Réinitialiser toutes les instances
      this.instances.clear();
      this.defaultInstanceName = "default";
    }
  }
}
