import { IHttp, IHttpConfig } from '../services/inerfaces';
export declare class ApiRequesteFactory {
    static create(httpConfig: IHttpConfig): IHttp;
}
