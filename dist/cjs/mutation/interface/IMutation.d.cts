import { BuildOnly, MutationResponse } from '../types/mutation.cjs';
import { ActionRequest, ActionResponse } from '../types/action.cjs';
import { DeleteRequest, DeleteResponse } from '../types/delete.cjs';
import { RequestConfig } from '../../http/types/http.cjs';
export interface IMutation<T> {
    mutate: (mutateRequest: BuildOnly<T>, options?: Partial<RequestConfig>) => Promise<MutationResponse>;
    executeAction: (actionRequest: ActionRequest, options?: Partial<RequestConfig>) => Promise<ActionResponse>;
    delete: (request: DeleteRequest, options?: Partial<RequestConfig>) => Promise<DeleteResponse<T>>;
    forceDelete: (request: DeleteRequest, options?: Partial<RequestConfig>) => Promise<DeleteResponse<T>>;
    restore: (request: DeleteRequest, options?: Partial<RequestConfig>) => Promise<DeleteResponse<T>>;
}
