import { HttpConfigOptions } from "../types.js";
export declare class HttpConfig {
  static getFullBaseUrl(options: HttpConfigOptions): string;
  static logError(error: any): void;
}
