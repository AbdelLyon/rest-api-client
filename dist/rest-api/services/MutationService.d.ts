import { ApiService } from './ApiService';
import { DeleteRequest, DeleteResponse } from '../interfaces/delete';
import { ActionRequest, ActionResponse } from '../interfaces/action';
import { MutateRequest, MutateResponse } from '../interfaces/mutate';
import { AxiosRequestConfig } from 'axios';
export interface IMutationService<T> {
    mutate: <TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>>(mutateRequest: MutateRequest<TAttributes, TRelations, TRelationAttributesMap>) => Promise<MutateResponse<T>>;
    executeAction: (actionRequest: ActionRequest) => Promise<ActionResponse>;
    delete: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
    forceDelete: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
    restore: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
}
export declare abstract class MutationService<T> extends ApiService implements IMutationService<T> {
    constructor(domain: string, pathname: string);
    mutate<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>>(mutateRequest: MutateRequest<TAttributes, TRelations, TRelationAttributesMap>, options?: Partial<AxiosRequestConfig>): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest, options?: Partial<AxiosRequestConfig>): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
}
