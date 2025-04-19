import { z } from 'zod';
import { DeleteRequest, DeleteResponse } from './types/delete.cjs';
import { ActionRequest, ActionResponse } from './types/action.cjs';
import { BuildOnly, MutationResponse } from './types/mutation.cjs';
import { RequestConfig } from '../http/types/http.cjs';
import { IRelationBuilder } from './interface/IRelationBuilder.cjs';
import { IMutation } from './interface/IMutation.cjs';
import { IEntityBuilder } from './interface/IEntityBuilder.cjs';
import { HttpClient } from '../http/HttpClient.cjs';
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
