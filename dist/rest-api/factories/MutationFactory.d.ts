import { IApiRequest, IMutation } from '../services/inerfaces';
export declare class MutationFactory {
    static create<T>(apiRequest: IApiRequest): IMutation<T>;
}
