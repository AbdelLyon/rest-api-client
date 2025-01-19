import {
  ActionRequest,
  ActionResponse,
  DeleteRequest,
  DeleteResponse,
  MutateRequest,
  MutateResponse,
} from "@/types";
import { AxiosRequestConfig } from "axios";

export interface IMutation<T> {
  mutate<TAttributes, TRelations>(
    mutateRequest: MutateRequest<TAttributes, TRelations>,
    options?: Partial<AxiosRequestConfig>,
  ): Promise<MutateResponse<T>>;

  executeAction(
    actionRequest: ActionRequest,
    options?: Partial<AxiosRequestConfig>,
  ): Promise<ActionResponse>;

  delete(
    request: DeleteRequest,
    options?: Partial<AxiosRequestConfig>,
  ): Promise<DeleteResponse<T>>;

  forceDelete(
    request: DeleteRequest,
    options?: Partial<AxiosRequestConfig>,
  ): Promise<DeleteResponse<T>>;

  restore(
    request: DeleteRequest,
    options?: Partial<AxiosRequestConfig>,
  ): Promise<DeleteResponse<T>>;
}
