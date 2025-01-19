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

export interface Permission {
  authorized_to_view: boolean;
  authorized_to_create: boolean;
  authorized_to_update: boolean;
  authorized_to_delete: boolean;
  authorized_to_restore: boolean;
  authorized_to_force_delete: boolean;
}
