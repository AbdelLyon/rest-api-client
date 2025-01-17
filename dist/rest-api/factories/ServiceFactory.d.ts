import { IApiRequest, IHttpConfig, IMutation, IQuery } from '../services/inerfaces';
interface ServiceBundle<T> {
    apiRequest: IApiRequest;
    queryService: IQuery<T>;
    mutationService: IMutation<T>;
}
export declare class ServiceFactory {
    static createApiRequest(httpConfig: IHttpConfig): IApiRequest;
    static createQueryService<T>(apiRequest: IApiRequest): IQuery<T>;
    static createMutationService<T>(apiRequest: IApiRequest): IMutation<T>;
    static createAll<T>(httpConfig: IHttpConfig): ServiceBundle<T>;
}
export {};
