import { IApiRequest, IQuery } from '../services/inerfaces';
export declare class QueryServiceFactory {
    static create<T>(apiRequest: IApiRequest): IQuery<T>;
}
