import { HttpConfig, RequestConfig } from "../types/http.js";
export declare class Interceptor {
  private static requestInterceptors;
  private static responseSuccessInterceptors;
  private static responseErrorInterceptors;
  static addInterceptors(httpConfig: HttpConfig): void;
  static applyRequestInterceptors(
    config: RequestConfig,
  ): Promise<RequestConfig>;
  static applyResponseSuccessInterceptors(
    response: Response,
  ): Promise<Response>;
  static applyResponseErrorInterceptors(error: any): Promise<any>;
  static setupDefaultErrorInterceptor(logCallback: (error: any) => void): void;
}
