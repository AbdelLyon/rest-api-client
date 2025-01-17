import { IApiRequest, IQuery } from '../services/inerfaces';
export declare class QueryFactory {
    static create<T>(apiRequest: IApiRequest): IQuery<T>;
}
