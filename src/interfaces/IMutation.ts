import {
} from "@/types";
import { RequestConfig } from "@/types/common";
import type { ModelAttributes, MutationRequest, MutationResponse } from '@/types/mutate';
import type { ActionRequest, ActionResponse } from '@/types/action';
import type { DeleteRequest, DeleteResponse } from '@/types/delete';


export interface IMutation<T> {

  mutate<TAttributes extends ModelAttributes,
    TRelations extends Record<string, unknown>
  >(
    mutateRequest: MutationRequest<TAttributes, TRelations>,
    options?: Partial<RequestConfig>
  ): Promise<MutationResponse<T>>;

  executeAction(
    actionRequest: ActionRequest,
    options?: Partial<RequestConfig>,
  ): Promise<ActionResponse>;

  delete(
    request: DeleteRequest,
    options?: Partial<RequestConfig>,
  ): Promise<DeleteResponse<T>>;

  forceDelete(
    request: DeleteRequest,
    options?: Partial<RequestConfig>,
  ): Promise<DeleteResponse<T>>;

  restore(
    request: DeleteRequest,
    options?: Partial<RequestConfig>,
  ): Promise<DeleteResponse<T>>;
}
