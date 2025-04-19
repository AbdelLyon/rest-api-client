import { HttpClient } from "./HttpClient.js";
import { HttpConfig } from "./types/http.js";
export declare class HttpManager {
  private static instances;
  private static defaultInstanceName;
  static init(config: {
    httpConfig: HttpConfig;
    instanceName: string;
  }): HttpClient;
  static getInstance(instanceName?: string): HttpClient;
  static setDefaultInstance(instanceName: string): void;
  static getAvailableInstances(): Array<string>;
  static resetInstance(instanceName?: string): void;
}
