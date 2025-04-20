import { RequestConfig } from "../types.js";
export declare class ApiRequestError extends Error {
  status?: number;
  statusText?: string;
  data?: unknown;
  originalError: unknown;
  requestConfig: RequestConfig;
  constructor(error: unknown, requestConfig: RequestConfig);
  isNotFound(): boolean;
  isUnauthorized(): boolean;
  isForbidden(): boolean;
  isServerError(): boolean;
  isNetworkError(): boolean;
}
