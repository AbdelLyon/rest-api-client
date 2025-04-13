import {
  ActionRequest,
  ActionResponse,
  DeleteRequest,
  DeleteResponse,
  MutationRequest,
  MutationResponse,
} from "@/types";
import { RequestConfig } from "@/types/common";


export interface IMutation<T> {
  mutate<TAttributes, TRelations>(
    mutateRequest: MutationRequest<TAttributes, TRelations>,
    options?: Partial<RequestConfig>,
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
