import type {
  HttpConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseErrorInterceptor,
  ResponseSuccessInterceptor,
} from "@/http/types";

export class HttpInterceptor {
  private static requestInterceptors: Array<RequestInterceptor> = [];
  private static responseSuccessInterceptors: Array<ResponseSuccessInterceptor> =
    [];
  private static responseErrorInterceptors: Array<ResponseErrorInterceptor> =
    [];

  static addInterceptors(httpConfig: HttpConfig): void {
    this.requestInterceptors = [
      ...this.requestInterceptors,
      ...(httpConfig.interceptors?.request ?? []),
    ];

    if (httpConfig.interceptors?.response) {
      this.responseSuccessInterceptors = [
        ...this.responseSuccessInterceptors,
        ...(httpConfig.interceptors.response.success ?? []),
      ];

      this.responseErrorInterceptors = [
        ...this.responseErrorInterceptors,
        ...(httpConfig.interceptors.response.error ?? []),
      ];
    }
  }

  static async applyRequestInterceptors(
    config: RequestConfig,
  ): Promise<RequestConfig> {
    let interceptedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      interceptedConfig = await Promise.resolve(interceptor(interceptedConfig));
    }

    return interceptedConfig;
  }

  static async applyResponseSuccessInterceptors(
    response: Response,
  ): Promise<Response> {
    let interceptedResponse = response;

    for (const interceptor of this.responseSuccessInterceptors) {
      interceptedResponse = await Promise.resolve(
        interceptor(interceptedResponse.clone()),
      );
    }

    return interceptedResponse;
  }

  static async applyResponseErrorInterceptors(error: Error): Promise<Error> {
    let interceptedError = error;

    for (const interceptor of this.responseErrorInterceptors) {
      try {
        interceptedError = await Promise.resolve(interceptor(interceptedError));

        if (!(interceptedError instanceof Error)) {
          return interceptedError;
        }
      } catch (e) {
        interceptedError =
          e instanceof Error ? e : new Error("Unknown error occurred");
      }
    }

    return Promise.reject(interceptedError);
  }

  static setupDefaultErrorInterceptor(
    logCallback: (error: Error) => void,
  ): void {
    if (this.responseErrorInterceptors.length === 0) {
      this.responseErrorInterceptors.push((error) => {
        logCallback(error);
        return Promise.reject(error);
      });
    }
  }
}
