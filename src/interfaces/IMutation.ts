import {
} from "@/types";
import { RequestConfig } from "@/types/common";
import type { MutationResponse } from '@/types/mutate';
import type { ActionRequest, ActionResponse } from '@/types/action';
import type { DeleteRequest, DeleteResponse } from '@/types/delete';
import { Builder } from "@/services/MutateRequestBuilder";


export interface IMutation<T> {

  mutate(
    mutateRequest: Builder<T>,
    options?: Partial<RequestConfig>
  ): Promise<MutationResponse>;

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
