export type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;
export type ResponseSuccessInterceptor = (response: Response) => Promise<Response> | Response;
export type ResponseErrorInterceptor = (error: Error) => Promise<Error>;
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
export interface HandlerConfig {
    baseURL: string;
    defaultTimeout: number;
    defaultHeaders: Record<string, string>;
    maxRetries: number;
    withCredentials: boolean;
}
export interface RetryOptions {
    maxRetries: number;
    attempt: number;
    defaultTimeout: number;
    withCredentials: boolean;
}
export interface FetchResult {
    response: Response;
    timeoutId: ReturnType<typeof setTimeout>;
}
export interface RequestConfig extends RequestInit {
    url: string;
    params?: Record<string, string>;
    data?: unknown;
    timeout?: number;
    baseURL?: string;
    headers?: Record<string, string>;
    responseType?: "json" | "text" | "blob" | "arraybuffer";
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
export interface IHttpRequest {
    configure: (options: ConfigOptions) => void;
    request: <TResponse>(config: Partial<RequestConfig> & {
        url: string;
    }, options?: Partial<RequestConfig>) => Promise<TResponse>;
}
