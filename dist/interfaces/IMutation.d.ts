import { MutateRequest, MutateResponse } from '../types/mutate';
import { ActionRequest, ActionResponse } from '../types/action';
import { DeleteRequest, DeleteResponse } from '../types/delete';
export interface IMutation<T> {
    mutate: <TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>>(mutateRequest: MutateRequest<TAttributes, TRelations, TRelationAttributesMap>) => Promise<MutateResponse<T>>;
    executeAction: (actionRequest: ActionRequest) => Promise<ActionResponse>;
    delete: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
    forceDelete: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
    restore: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
}
