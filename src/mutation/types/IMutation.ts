import type { BuildOnly, MutationResponse } from "@/mutation/types/mutation";
import type { ActionRequest, ActionResponse } from "@/mutation/types/action";
import type { DeleteRequest, DeleteResponse } from "@/mutation/types/delete";
import type { RequestConfig } from "@/http/types/http";

export interface IMutation<T> {
  mutate: (
    mutateRequest: BuildOnly<T>,
    options?: Partial<RequestConfig>,
  ) => Promise<MutationResponse>;

  executeAction: (
    actionRequest: ActionRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<ActionResponse>;

  delete: (
    request: DeleteRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<DeleteResponse<T>>;

  forceDelete: (
    request: DeleteRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<DeleteResponse<T>>;

  restore: (
    request: DeleteRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<DeleteResponse<T>>;
}
