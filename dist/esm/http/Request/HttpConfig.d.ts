import { ConfigOptions } from "../types.js";
interface ApiError extends Error {
  config?: {
    url?: string;
    method?: string;
  };
  status?: number;
  data?: unknown;
}
export declare class HttpConfig {
  static getFullBaseUrl(options: ConfigOptions): string;
  static logError(error: ApiError): void;
}
export {};
