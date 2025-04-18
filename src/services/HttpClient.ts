import type { IHttpClient } from "@/interfaces";
import type { HttpConfig, HttpConfigOptions, RequestConfig, RequestInterceptor, ResponseErrorInterceptor, ResponseSuccessInterceptor } from "@/types/common";
import { ApiRequestError } from "./ApiRequestError";

export class HttpClient implements IHttpClient {
  private static instances: Map<string, HttpClient> = new Map();
  private static defaultInstanceName: string;

  private static requestInterceptors: RequestInterceptor[] = [];
  private static responseSuccessInterceptors: ResponseSuccessInterceptor[] = [];
  private static responseErrorInterceptors: ResponseErrorInterceptor[] = [];

  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;
  private withCredentials: boolean;
  private maxRetries: number;

  private constructor () {
    this.baseURL = "";
    this.defaultTimeout = 10000;
    this.defaultHeaders = {};
    this.withCredentials = true;
    this.maxRetries = 3;
  }


  static init(config: {
    httpConfig: HttpConfig;
    instanceName: string;
  }): HttpClient {
    const { httpConfig, instanceName } = config;

    HttpClient.requestInterceptors = [
      ...HttpClient.requestInterceptors,
      ...(httpConfig.interceptors?.request ?? [])
    ];

    if (httpConfig.interceptors?.response) {
      HttpClient.responseSuccessInterceptors = [
        ...HttpClient.responseSuccessInterceptors,
        ...(httpConfig.interceptors.response.success ?? [])
      ];

      HttpClient.responseErrorInterceptors = [
        ...HttpClient.responseErrorInterceptors,
        ...(httpConfig.interceptors.response.error ?? [])
      ];
    }

    if (!this.instances.has(instanceName)) {
      const instance = new HttpClient();
      instance.configure(httpConfig);
      this.instances.set(instanceName, instance);

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

  static resetInstance(instanceName?: string): void {
    if (instanceName) {
      this.instances.delete(instanceName);

      if (
        instanceName === this.defaultInstanceName &&
        this.instances.size > 0
      ) {
        this.defaultInstanceName =
          this.instances.keys().next().value ?? "default";
      }
    } else {
      this.instances.clear();
      this.defaultInstanceName = "default";
    }
  }

  private configure(options: HttpConfigOptions): void {

    this.baseURL = this.getFullBaseUrl(options);
    this.defaultTimeout = options.timeout ?? 10000;
    this.maxRetries = options.maxRetries ?? 3;
    this.withCredentials = options.withCredentials ?? true;

    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...options.headers,
    };

    this.setupDefaultInterceptors();
  }

  private getFullBaseUrl(options: HttpConfigOptions): string {
    if (!options.baseURL) {
      throw new Error("baseURL is required in HttpConfigOptions");
    }

    let baseUrl = options.baseURL.trim();
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    if (options.apiPrefix) {
      let prefix = options.apiPrefix.trim();
      if (!prefix.startsWith("/")) {
        prefix = "/" + prefix;
      }
      if (prefix.endsWith("/")) {
        prefix = prefix.slice(0, -1);
      }

      return baseUrl + prefix;
    }

    if (options.apiVersion) {
      return `${baseUrl}/v${options.apiVersion}`;
    }

    return baseUrl;
  }

  private setupDefaultInterceptors(): void {

    if (HttpClient.responseErrorInterceptors.length === 0) {
      HttpClient.responseErrorInterceptors.push((error) => {
        this.logError(error);
        return Promise.reject(error);
      });
    }
  }

  private logError(error: any): void {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.status,
      data: error.data,
      message: error.message,
    };

    console.error("API Request Error", errorDetails);
  }

  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let interceptedConfig = { ...config };

    for (const interceptor of HttpClient.requestInterceptors) {
      interceptedConfig = await Promise.resolve(interceptor(interceptedConfig));
    }

    return interceptedConfig;
  }

  private async applyResponseSuccessInterceptors(response: Response): Promise<Response> {
    let interceptedResponse = response;

    for (const interceptor of HttpClient.responseSuccessInterceptors) {
      interceptedResponse = await Promise.resolve(interceptor(interceptedResponse.clone()));
    }

    return interceptedResponse;
  }

  private async applyResponseErrorInterceptors(error: any): Promise<any> {
    let interceptedError = error;

    for (const interceptor of HttpClient.responseErrorInterceptors) {
      try {
        interceptedError = await Promise.resolve(interceptor(interceptedError));

        if (!(interceptedError instanceof Error)) {
          return interceptedError;
        }
      } catch (e) {
        interceptedError = e;
      }
    }

    return Promise.reject(interceptedError);
  }

  private isRetryableError(status: number, method?: string): boolean {
    const idempotentMethods = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'];
    const isIdempotent = !method || idempotentMethods.includes(method.toUpperCase());

    return (
      isIdempotent && (
        status === 0 ||
        status === 429 ||
        (status >= 500 && status < 600)
      )
    );
  }

  private async fetchWithRetry(
    url: string,
    config: RequestConfig,
    attempt: number = 1
  ): Promise<Response> {
    try {
      const { timeout = this.defaultTimeout, params, data, ...fetchOptions } = config;
      let fullUrl = url;

      if (params && Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          queryParams.append(key, value);
        }
        fullUrl += `?${queryParams.toString()}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort('Request timeout'), timeout);

      let body: any = undefined;
      if (data !== undefined) {
        body = typeof data === 'string' ? data : JSON.stringify(data);
      }

      const response = await fetch(fullUrl, {
        ...fetchOptions,
        body,
        signal: controller.signal,
        credentials: this.withCredentials ? 'include' : 'same-origin',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (
          attempt < this.maxRetries &&
          this.isRetryableError(response.status, config.method)
        ) {
          const delay = Math.pow(2, attempt) * 100;
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.fetchWithRetry(url, config, attempt + 1);
        }
      }

      return response;

    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${config.timeout || this.defaultTimeout}ms`);
      }

      if (attempt < this.maxRetries && this.isRetryableError(0, config.method)) {
        const delay = Math.pow(2, attempt) * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, config, attempt + 1);
      }

      throw error;
    }
  }

  public async request<TResponse = any>(
    config: Partial<RequestConfig> & { url: string; },
    options: Partial<RequestConfig> = {},
  ): Promise<TResponse> {
    try {
      const mergedConfig: RequestConfig = {
        method: 'GET',
        timeout: this.defaultTimeout,
        ...config,
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...(config.headers || {}),
          ...(options.headers || {})
        }
      };

      const url = new URL(
        mergedConfig.url.startsWith('http')
          ? mergedConfig.url
          : `${this.baseURL}${mergedConfig.url.startsWith('/') ? '' : '/'}${mergedConfig.url}`
      ).toString();

      const interceptedConfig = await this.applyRequestInterceptors({
        ...mergedConfig,
        url
      });

      let response = await this.fetchWithRetry(url, interceptedConfig);

      response = await this.applyResponseSuccessInterceptors(response);

      if (response.headers.get('content-type')?.includes('application/json')) {
        return await response.json() as TResponse;
      } else {
        return await response.text() as unknown as TResponse;
      }

    } catch (error) {
      const apiError = error instanceof ApiRequestError
        ? error
        : new ApiRequestError(error, {
          ...config,
          ...options,
          url: config.url
        });

      return this.applyResponseErrorInterceptors(apiError);
    }
  }
}