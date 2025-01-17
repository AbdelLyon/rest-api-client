import { AxiosRequestConfig } from 'axios';
import { DeleteRequest, DeleteResponse } from '../types/delete';
import { ActionRequest, ActionResponse } from '../types/action';
import { MutateRequest, MutateResponse } from '../types/mutate';
import { IApiRequest, IMutation } from './inerfaces';
export declare class MutationService<T> implements IMutation<T> {
    private readonly apiRequest;
    constructor(apiRequest: IApiRequest);
    mutate<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>>(mutateRequest: MutateRequest<TAttributes, TRelations, TRelationAttributesMap>, options?: Partial<AxiosRequestConfig>): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest, options?: Partial<AxiosRequestConfig>): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
}
