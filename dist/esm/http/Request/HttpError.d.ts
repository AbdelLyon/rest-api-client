import { RequestConfig } from "../types.js";
export declare class HttpError extends Error {
  status?: number;
  statusText?: string;
  data?: unknown;
  readonly originalError: unknown;
  readonly requestConfig: RequestConfig;
  constructor(error: unknown, requestConfig: RequestConfig);
  private extractErrorDetails;
  getErrorType(): "network" | "client" | "server" | "unknown";
  hasStatus(status: number): boolean;
}
