import { IApiRequest, IHttpConfig } from '../services/inerfaces';
export declare class ApiRequesteFactory {
    static create(httpConfig: IHttpConfig): IApiRequest;
}
