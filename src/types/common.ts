export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface HttpConfigOptions {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  maxRetries?: number;
}
