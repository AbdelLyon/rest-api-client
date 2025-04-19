import { BuildOnly, MutationResponse } from '../types/mutation.js';
import { ActionRequest, ActionResponse } from '../types/action.js';
import { DeleteRequest, DeleteResponse } from '../types/delete.js';
import { RequestConfig } from '../../http/types/http.js';
export interface IMutation<T> {
    mutate: (mutateRequest: BuildOnly<T>, options?: Partial<RequestConfig>) => Promise<MutationResponse>;
    executeAction: (actionRequest: ActionRequest, options?: Partial<RequestConfig>) => Promise<ActionResponse>;
    delete: (request: DeleteRequest, options?: Partial<RequestConfig>) => Promise<DeleteResponse<T>>;
    forceDelete: (request: DeleteRequest, options?: Partial<RequestConfig>) => Promise<DeleteResponse<T>>;
    restore: (request: DeleteRequest, options?: Partial<RequestConfig>) => Promise<DeleteResponse<T>>;
}
