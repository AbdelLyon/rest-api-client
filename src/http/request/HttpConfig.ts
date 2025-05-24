import type { ConfigOptions } from "@/http/types";

interface ApiError extends Error {
  config?: {
    url?: string;
    method?: string;
  };
  status?: number;
  data?: unknown;
}

export class HttpConfig {
  static getFullBaseUrl(options: ConfigOptions): string {
    if (!options.baseURL) {
      throw new Error("baseURL is required in HttpConfigOptions");
    }

    const baseUrl = options.baseURL.trim().replace(/\/$/, "");

    if (options.apiPrefix) {
      const prefix = options.apiPrefix
        .trim()
        .replace(/^(?!\/)/, "/")
        .replace(/\/$/, "");

      return `${baseUrl}${prefix}`;
    }

    if (options.apiVersion) {
      return `${baseUrl}/v${options.apiVersion}`;
    }

    return baseUrl;
  }

  static logError(error: ApiError): void {
    const { config, status, data, message } = error;

    const errorDetails = {
      url: config?.url,
      method: config?.method,
      status,
      data,
      message,
    };

    console.error("API Request Error:", errorDetails);
  }
}
