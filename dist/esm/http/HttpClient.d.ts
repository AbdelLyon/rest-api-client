import { HttpRequest } from "./common/HttpRequest.js";
import { HttpConfig } from "./types/http.js";
export declare class HttpClient {
  private static instances;
  private static defaultInstanceName;
  static init(config: {
    httpConfig: HttpConfig;
    instanceName: string;
  }): HttpRequest;
  static getInstance(instanceName?: string): HttpRequest;
  static setDefaultInstance(instanceName: string): void;
  static getAvailableInstances(): Array<string>;
  static resetInstance(instanceName?: string): void;
}
