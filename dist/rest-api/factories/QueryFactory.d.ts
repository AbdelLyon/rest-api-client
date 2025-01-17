import { IHttp, IQuery } from '../services/inerfaces';
export declare class QueryFactory {
    static create<T>(apiRequest: IHttp): IQuery<T>;
}
