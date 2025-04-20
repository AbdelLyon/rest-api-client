export type RequestInterceptor = (
  config: RequestConfig,
) => Promise<RequestConfig> | RequestConfig;

// ==================== types de configuration http ====================

export type ResponseSuccessInterceptor = (
  response: Response,
) => Promise<Response> | Response;

export type ResponseErrorInterceptor = (error: any) => Promise<any>;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ConfigOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  maxRetries?: number;
  apiPrefix?: string;
  apiVersion?: string | number;
}

export interface Permission {
  authorized_to_view: boolean;
  authorized_to_create: boolean;
  authorized_to_update: boolean;
  authorized_to_delete: boolean;
  authorized_to_restore: boolean;
  authorized_to_force_delete: boolean;
}

export interface RequestConfig extends RequestInit {
  url: string;
  params?: Record<string, string>;
  data?: any;
  timeout?: number;
  baseURL?: string;
  headers?: Record<string, string>;
}

export interface ApiErrorSource {
  [key: string]: unknown;
  status?: number;
  statusText?: string;
  data?: unknown;
  response?: Response;
}

export interface HttpConfig extends ConfigOptions {
  interceptors?: {
    request?: Array<RequestInterceptor>;
    response?: {
      success?: Array<ResponseSuccessInterceptor>;
      error?: Array<ResponseErrorInterceptor>;
    };
  };
}

// ==================== Interfaces ====================

export interface IHttpRequest {
  configure: (options: ConfigOptions) => void;

  request: <TResponse = any>(
    config: Partial<RequestConfig> & { url: string },
    options?: Partial<RequestConfig>,
  ) => Promise<TResponse>;
}
