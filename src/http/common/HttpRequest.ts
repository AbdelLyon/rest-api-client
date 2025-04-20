import type {
  HttpConfigOptions,
  IHttpRequest,
  RequestConfig,
} from "@/http/types";
import { HttpConfig } from "@/http/common/HttpConfig";
import { Interceptor } from "@/http/common/Interceptor";
import { ApiRequestError } from "@/http/common/ApiRequestError";

export class HttpRequest implements IHttpRequest {
  private baseURL = "";
  private defaultTimeout = 10000;
  private defaultHeaders: Record<string, string> = {};
  private withCredentials = true;
  private maxRetries = 3;

  configure(options: HttpConfigOptions): void {
    this.baseURL = HttpConfig.getFullBaseUrl(options);
    this.defaultTimeout = options.timeout ?? 10000;
    this.maxRetries = options.maxRetries ?? 3;
    this.withCredentials = options.withCredentials ?? true;

    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    Interceptor.setupDefaultErrorInterceptor(HttpConfig.logError);
    Interceptor.addInterceptors(options);
  }

  public async request<TResponse = any>(
    config: Partial<RequestConfig> & { url: string },
    options: Partial<RequestConfig> = {},
  ): Promise<TResponse> {
    try {
      const mergedConfig = this.createMergedConfig(config, options);
      const url = this.buildRequestUrl(mergedConfig.url);
      const interceptedConfig = await this.applyRequestInterceptors(
        mergedConfig,
        url,
      );

      let response = await this.executeRequest(url, interceptedConfig);
      response = await Interceptor.applyResponseSuccessInterceptors(response);

      return await this.parseResponse<TResponse>(response);
    } catch (error) {
      return this.handleRequestError(error, config, options);
    }
  }

  private createMergedConfig(
    config: Partial<RequestConfig> & { url: string },
    options: Partial<RequestConfig>,
  ): RequestConfig {
    return {
      method: "GET",
      timeout: this.defaultTimeout,
      ...config,
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(config.headers || {}),
        ...(options.headers || {}),
      },
    };
  }

  private buildRequestUrl(requestUrl: string): string {
    if (requestUrl.startsWith("http")) {
      return requestUrl;
    }

    const prefix = requestUrl.startsWith("/") ? "" : "/";
    return new URL(`${this.baseURL}${prefix}${requestUrl}`).toString();
  }

  private async applyRequestInterceptors(
    config: RequestConfig,
    url: string,
  ): Promise<RequestConfig> {
    return Interceptor.applyRequestInterceptors({
      ...config,
      url,
    });
  }

  private async executeRequest(
    url: string,
    config: RequestConfig,
  ): Promise<Response> {
    return this.fetchWithRetry(
      url,
      config,
      this.maxRetries,
      this.defaultTimeout,
      this.withCredentials,
    );
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (response.headers.get("content-type")?.includes("application/json")) {
      return (await response.json()) as T;
    }
    return (await response.text()) as T;
  }

  private handleRequestError(
    error: unknown,
    config: Partial<RequestConfig> & { url: string },
    options: Partial<RequestConfig>,
  ): Promise<any> {
    const apiError =
      error instanceof ApiRequestError
        ? error
        : new ApiRequestError(error, {
            ...config,
            ...options,
            url: config.url,
          });

    return Interceptor.applyResponseErrorInterceptors(apiError);
  }

  private isRetryableError(status: number, method?: string): boolean {
    const idempotentMethods = ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"];
    const isIdempotent =
      !method || idempotentMethods.includes(method.toUpperCase());

    return (
      isIdempotent &&
      (status === 0 || status === 429 || (status >= 500 && status < 600))
    );
  }

  private async fetchWithRetry(
    url: string,
    config: RequestConfig,
    maxRetries: number,
    defaultTimeout: number,
    withCredentials: boolean,
    attempt: number = 1,
  ): Promise<Response> {
    try {
      const { response, timeoutId } = await this.performFetch(
        url,
        config,
        defaultTimeout,
        withCredentials,
      );
      clearTimeout(timeoutId);

      if (
        !response.ok &&
        this.shouldRetry(response.status, config.method, attempt, maxRetries)
      ) {
        return this.retryWithBackoff(
          url,
          config,
          maxRetries,
          defaultTimeout,
          withCredentials,
          attempt,
        );
      }

      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(
          `Request timeout after ${config.timeout || defaultTimeout}ms`,
        );
      }

      if (attempt < maxRetries && this.isRetryableError(0, config.method)) {
        return this.retryWithBackoff(
          url,
          config,
          maxRetries,
          defaultTimeout,
          withCredentials,
          attempt,
        );
      }

      throw error;
    }
  }

  private async performFetch(
    url: string,
    config: RequestConfig,
    defaultTimeout: number,
    withCredentials: boolean,
  ): Promise<{
    response: Response;
    timeoutId: number | ReturnType<typeof setTimeout>;
  }> {
    const { timeout = defaultTimeout, params, data, ...fetchOptions } = config;

    const fullUrl = this.appendQueryParams(url, params);
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort("Request timeout"),
      timeout,
    );
    const body = this.prepareRequestBody(data);

    const response = await fetch(fullUrl, {
      ...fetchOptions,
      body,
      signal: controller.signal,
      credentials: withCredentials ? "include" : "same-origin",
    });

    return { response, timeoutId };
  }

  private appendQueryParams(
    url: string,
    params?: Record<string, string>,
  ): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      queryParams.append(key, value);
    }

    return `${url}?${queryParams.toString()}`;
  }

  private prepareRequestBody(data: any): string | undefined {
    if (data === undefined) {
      return undefined;
    }

    return typeof data === "string" ? data : JSON.stringify(data);
  }

  private shouldRetry(
    status: number,
    method?: string,
    attempt?: number,
    maxRetries?: number,
  ): boolean {
    return (
      attempt !== undefined &&
      maxRetries !== undefined &&
      attempt < maxRetries &&
      this.isRetryableError(status, method)
    );
  }

  private async retryWithBackoff(
    url: string,
    config: RequestConfig,
    maxRetries: number,
    defaultTimeout: number,
    withCredentials: boolean,
    attempt: number,
  ): Promise<Response> {
    const delay = Math.pow(2, attempt) * 100;
    await new Promise((resolve) => setTimeout(resolve, delay));

    return this.fetchWithRetry(
      url,
      config,
      maxRetries,
      defaultTimeout,
      withCredentials,
      attempt + 1,
    );
  }
}
