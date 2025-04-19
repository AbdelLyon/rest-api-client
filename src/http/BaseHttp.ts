import { HttpConfig } from "./HttpConfig";
import { HttpRequest } from "./HttpRequest";
import { Interceptor } from "./Interceptor";
import type { IBaseHttp } from "./interface/IBaseHttp";
import type { HttpConfigOptions, RequestConfig } from "./types/http";
import { ApiRequestError } from "@/error/ApiRequestError";

export class BaseHttp implements IBaseHttp {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;
  private withCredentials: boolean;
  private maxRetries: number;

  constructor() {
    this.baseURL = "";
    this.defaultTimeout = 10000;
    this.defaultHeaders = {};
    this.withCredentials = true;
    this.maxRetries = 3;
  }

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

  async request<TResponse = any>(
    config: Partial<RequestConfig> & { url: string },
    options: Partial<RequestConfig> = {},
  ): Promise<TResponse> {
    try {
      const mergedConfig: RequestConfig = {
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

      const url = new URL(
        mergedConfig.url.startsWith("http")
          ? mergedConfig.url
          : `${this.baseURL}${mergedConfig.url.startsWith("/") ? "" : "/"}${mergedConfig.url}`,
      ).toString();

      const interceptedConfig = await Interceptor.applyRequestInterceptors({
        ...mergedConfig,
        url,
      });

      let response = await HttpRequest.fetchWithRetry(
        url,
        interceptedConfig,
        this.maxRetries,
        this.defaultTimeout,
        this.withCredentials,
      );

      response = await Interceptor.applyResponseSuccessInterceptors(response);

      if (response.headers.get("content-type")?.includes("application/json")) {
        return (await response.json()) as TResponse;
      } else {
        return (await response.text()) as TResponse;
      }
    } catch (error) {
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
  }
}
