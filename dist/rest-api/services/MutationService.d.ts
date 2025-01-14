import { ApiService } from './ApiService';
import { ActionRequest, ActionResponse } from '../interfaces/action';
import { MutateRequest, MutateResponse } from '../interfaces/mutate';
import { AxiosRequestConfig } from 'axios';
export interface IMutationService<T> {
    mutate: <TAttributes, TRelations>(mutateRequest: MutateRequest<TAttributes, TRelations>) => Promise<MutateResponse<T>>;
    executeAction: (actionRequest: ActionRequest) => Promise<ActionResponse>;
}
export declare abstract class MutationService<T> extends ApiService implements IMutationService<T> {
    protected constructor(domain: string, pathname: string);
    mutate<TAttributes, TRelations>(mutateRequest: MutateRequest<TAttributes, TRelations>, options?: Partial<AxiosRequestConfig>): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest, options?: Partial<AxiosRequestConfig>): Promise<ActionResponse>;
}
