import { HttpConfigOptions } from "../types/http.js";
export declare class HttpConfig {
  static getFullBaseUrl(options: HttpConfigOptions): string;
  static logError(error: any): void;
}
