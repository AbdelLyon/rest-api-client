import { DeleteRequest, DeleteResponse } from './types/delete';
import { ActionRequest, ActionResponse } from './types/action';
import { BuildOnly, MutationResponse } from './types/mutation';
import { RequestConfig } from '../http/types/http';
import { IRelationBuilder } from './interface/IRelationBuilder';
import { IMutation } from './interface/IMutation';
import { IEntityBuilder } from './interface/IEntityBuilder';
import { z } from 'zod';
import { HttpClient } from '../http/HttpClient';
export declare abstract class Mutation<T> implements IMutation<T> {
    protected http: HttpClient;
    protected pathname: string;
    protected schema: z.ZodType<T>;
    private readonly relation;
    constructor(pathname: string, schema: z.ZodType<T>);
    entityBuilder(): IEntityBuilder<T>;
    relationBuilder(): IRelationBuilder;
    private validateData;
    mutate(mutateRequest: BuildOnly<T> | {
        mutate: Array<any>;
    }, options?: Partial<RequestConfig>): Promise<MutationResponse>;
    executeAction(actionRequest: ActionRequest, options?: Partial<RequestConfig>): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
}
