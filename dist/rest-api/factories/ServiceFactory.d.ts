import { IHttp, IHttpConfig, IMutation, IQuery } from '../services/inerfaces';
interface ServiceBundle<T> {
    apiRequest: IHttp;
    queryService: IQuery<T>;
    mutationService: IMutation<T>;
}
export declare class ServiceFactory {
    static createApiRequest(httpConfig: IHttpConfig): IHttp;
    static createQuery<T>(apiRequest: IHttp): IQuery<T>;
    static createMutation<T>(apiRequest: IHttp): IMutation<T>;
    static createAll<T>(httpConfig: IHttpConfig): ServiceBundle<T>;
}
export {};
