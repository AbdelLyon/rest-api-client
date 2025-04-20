import { Request } from "./Request/Request.js";
import { HttpConfig } from "./types.js";
export declare class HttpClient {
  private static instances;
  private static defaultInstanceName;
  static init(config: {
    httpConfig: HttpConfig;
    instanceName: string;
  }): Request;
  static getInstance(instanceName?: string): Request;
  static setDefaultInstance(instanceName: string): void;
  static getAvailableInstances(): Array<string>;
  static resetInstance(instanceName?: string): void;
}
