import { Http } from './Http';
import { AxiosRequestConfig } from 'axios';
import { DeleteRequest, DeleteResponse } from '../types/delete';
import { ActionRequest, ActionResponse } from '../types/action';
import { MutateRequest, MutateResponse } from '../types/mutate';
import { IMutation } from './inerfaces';
export declare class Mutation<T> extends Http implements IMutation<T> {
    mutate<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>>(mutateRequest: MutateRequest<TAttributes, TRelations, TRelationAttributesMap>, options?: Partial<AxiosRequestConfig>, pathname?: string): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest, options?: Partial<AxiosRequestConfig>, pathname?: string): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>, pathname?: string): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>, pathname?: string): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<AxiosRequestConfig>, pathname?: string): Promise<DeleteResponse<T>>;
}
