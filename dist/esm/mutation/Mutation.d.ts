import { z } from 'zod';
import { HttpRequest } from '../http/request/HttpRequest.js';
import { ActionRequest, ActionResponse, BuilderWithCreationContext, BuilderWithUpdateContext, DeleteRequest, DeleteResponse, IModel, IMutation, IRelation, MutationRequest, MutationResponse } from './types.js';
export declare abstract class Mutation<T> implements IMutation<T> {
    protected http: HttpRequest;
    protected pathname: string;
    protected schema: z.ZodType<T>;
    private readonly _relation;
    constructor(pathname: string, schema: z.ZodType<T>, httpInstanceName?: string);
    get model(): IModel<T>;
    get relation(): IRelation;
    private validateData;
    mutate(mutateRequest: BuilderWithCreationContext<T> | BuilderWithUpdateContext<T> | MutationRequest<T, Record<string, unknown>>): Promise<MutationResponse>;
    action(actionRequest: ActionRequest): Promise<ActionResponse>;
    delete(request: DeleteRequest): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest): Promise<DeleteResponse<T>>;
}
