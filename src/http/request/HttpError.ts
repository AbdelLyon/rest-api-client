import type { ApiErrorSource, RequestConfig } from "@/http/types";

export class HttpError extends Error {
  status?: number;
  statusText?: string;
  data?: unknown;
  readonly originalError: unknown;
  readonly requestConfig: RequestConfig;

  constructor(error: unknown, requestConfig: RequestConfig) {
    const message =
      error instanceof Error ? error.message : "API Service Request Failed";

    super(message);
    this.name = "ApiRequestError";
    this.originalError = error;
    this.requestConfig = requestConfig;

    this.extractErrorDetails(error);
  }

  private extractErrorDetails(error: unknown): void {
    if (!error || typeof error !== "object") return;

    const errorSource = error as ApiErrorSource;

    this.status = errorSource.status;
    this.statusText = errorSource.statusText as string;
    this.data = errorSource.data;

    if (errorSource.response instanceof Response) {
      const { response } = errorSource;
      this.status = response.status;
      this.statusText = response.statusText;
    }
  }

  getErrorType(): "network" | "client" | "server" | "unknown" {
    if (this.status === undefined || this.status === 0) {
      return "network";
    } else if (this.status >= 400 && this.status < 500) {
      return "client";
    } else if (this.status >= 500) {
      return "server";
    }
    return "unknown";
  }

  hasStatus(status: number): boolean {
    return this.status === status;
  }
}
