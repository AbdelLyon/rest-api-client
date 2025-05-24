import { HttpRequest } from './Request/HttpRequest.js';
import { HttpConfig } from './types.js';
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
