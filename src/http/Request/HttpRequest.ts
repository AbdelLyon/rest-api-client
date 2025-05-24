import { HttpHandler } from "./HttpHandler";
import { HttpError } from "./HttpError";
import type { ConfigOptions, IHttpRequest, RequestConfig } from "@/http/types";
import { HttpConfig } from "./HttpConfig";
import { HttpInterceptor } from "./HttpInterceptor";

export class HttpRequest implements IHttpRequest {
  private baseURL = "";
  private defaultTimeout = 10000;
  private defaultHeaders: Record<string, string> = {};
  private withCredentials = true;
  private maxRetries = 3;
  private handler: HttpHandler;

  constructor() {
    this.handler = new HttpHandler();
  }

  configure(options: ConfigOptions): void {
    this.baseURL = HttpConfig.getFullBaseUrl(options);
    this.defaultTimeout = options.timeout ?? 10000;
    this.maxRetries = options.maxRetries ?? 3;
    this.withCredentials = options.withCredentials ?? true;

    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    this.handler.configure({
      baseURL: this.baseURL,
      defaultTimeout: this.defaultTimeout,
      defaultHeaders: this.defaultHeaders,
      maxRetries: this.maxRetries,
      withCredentials: this.withCredentials,
    });

    HttpInterceptor.setupDefaultErrorInterceptor(HttpConfig.logError);
    HttpInterceptor.addInterceptors(options);
  }

  public async request<TResponse>(options: RequestConfig): Promise<TResponse> {
    try {
      const mergedConfig = this.createMergedConfig(options);
      const url = this.buildRequestUrl(mergedConfig.url);
      const interceptedConfig = await HttpInterceptor.applyRequestInterceptors({
        ...mergedConfig,
        url,
      });

      const response = await this.handler.executeRequest(
        url,
        interceptedConfig,
      );
      const interceptedResponse =
        await HttpInterceptor.applyResponseSuccessInterceptors(response);

      return await this.handler.parseResponse<TResponse>(interceptedResponse);
    } catch (error) {
      return this.handleReqError(error, options);
    }
  }

  private createMergedConfig(options: RequestConfig): RequestConfig {
    return {
      method: "GET",
      timeout: this.defaultTimeout,
      ...options,
      headers: {
        ...this.defaultHeaders,
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

  private async handleReqError<T>(
    error: unknown,
    options: RequestConfig,
  ): Promise<T> {
    const apiError =
      error instanceof HttpError ? error : new HttpError(error, options);

    throw await HttpInterceptor.applyResponseErrorInterceptors(apiError);
  }
}
