import { RequestConfig } from "@/types/common";

export class ApiRequestError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
  originalError: unknown;
  requestConfig: RequestConfig;

  constructor (error: unknown, requestConfig: RequestConfig) {
    // Créer un message d'erreur utile
    const message = error instanceof Error
      ? error.message
      : "API Service Request Failed";

    super(message);
    this.name = "ApiRequestError";
    this.originalError = error;
    this.requestConfig = requestConfig;

    // Extraire les informations utiles de l'erreur originale si possible
    if (error && typeof error === "object") {
      if ("status" in error) {
        this.status = (error as any).status;
      }
      if ("statusText" in error) {
        this.statusText = (error as any).statusText;
      }
      if ("data" in error) {
        this.data = (error as any).data;
      }
      // Si c'est une erreur de fetch (Response)
      if ("response" in error && (error as any).response instanceof Response) {
        const response = (error as any).response;
        this.status = response.status;
        this.statusText = response.statusText;
      }
    }

    // Capturer la stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiRequestError);
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