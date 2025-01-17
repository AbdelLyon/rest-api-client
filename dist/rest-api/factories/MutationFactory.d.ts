import { IHttp, IMutation } from '../services/inerfaces';
export declare class MutationFactory {
    static create<T>(apiRequest: IHttp): IMutation<T>;
}
