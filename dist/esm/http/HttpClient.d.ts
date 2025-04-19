import { BaseHttp } from "./shared/BaseHttp.js";
import { HttpConfig } from "./types/http.js";
export declare class HttpClient {
  private static instances;
  private static defaultInstanceName;
  static init(config: {
    httpConfig: HttpConfig;
    instanceName: string;
  }): BaseHttp;
  static getInstance(instanceName?: string): BaseHttp;
  static setDefaultInstance(instanceName: string): void;
  static getAvailableInstances(): Array<string>;
  static resetInstance(instanceName?: string): void;
}
