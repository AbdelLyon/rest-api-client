import { IApiRequest, IMutation } from '../services/inerfaces';
export declare class MutationServiceFactory {
    static create<T>(apiRequest: IApiRequest): IMutation<T>;
}
