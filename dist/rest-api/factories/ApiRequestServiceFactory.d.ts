import { IApiRequest, IHttpConfig } from '../services/inerfaces';
export declare class ApiRequestServiceFactory {
    static create(httpConfig: IHttpConfig): IApiRequest;
}
