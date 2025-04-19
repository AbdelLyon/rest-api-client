import type { ApiErrorSource, RequestConfig } from "@/http/types/http";

export class ApiRequestError extends Error {
  status?: number;
  statusText?: string;
  data?: unknown;
  originalError: unknown;
  requestConfig: RequestConfig;

  constructor (error: unknown, requestConfig: RequestConfig) {
    const message = error instanceof Error
      ? error.message
      : "API Service Request Failed";

    super(message);
    this.name = "ApiRequestError";
    this.originalError = error;
    this.requestConfig = requestConfig;

    if (error && typeof error === "object") {
      const errorObj = error as ApiErrorSource;

      if ("status" in errorObj) {
        this.status = errorObj.status;
      }
      if ("statusText" in errorObj) {
        this.statusText = errorObj.statusText as string;
      }
      if ("data" in errorObj) {
        this.data = errorObj.data;
      }
      // Si c'est une erreur de fetch (Response)
      if ("response" in errorObj && errorObj.response instanceof Response) {
        const response = errorObj.response;
        this.status = response.status;
        this.statusText = response.statusText;
      }
    }

  }

  // Méthodes utilitaires pour vérifier le type d'erreur
  isNotFound(): boolean {
    return this.status === 404;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isServerError(): boolean {
    return this.status !== undefined && this.status >= 500 && this.status < 600;
  }

  isNetworkError(): boolean {
    return this.status === undefined || this.status === 0;
  }
}