import "reflect-metadata";
import { Http } from "./Http";
import type { AxiosRequestConfig } from "axios";
import type { DeleteRequest, DeleteResponse } from "../types/delete";
import type { ActionRequest, ActionResponse } from "../types/action";
import type { MutateRequest, MutateResponse } from "../types/mutate";
import type { IMutation } from "./inerfaces";

export class Mutation<T> extends Http implements IMutation<T> {
  public mutate<
    TAttributes,
    TRelations,
    TRelationAttributesMap extends Record<keyof TRelations, unknown>,
  >(
    mutateRequest: MutateRequest<
      TAttributes,
      TRelations,
      TRelationAttributesMap
    >,
    options: Partial<AxiosRequestConfig> = {},
    pathname?: string,
  ): Promise<MutateResponse<T>> {
    return this.request<MutateResponse<T>>(
      {
        method: "POST",
        url: `{${pathname}/mutate}`,
        data: mutateRequest,
      },
      options,
    );
  }

  public executeAction(
    actionRequest: ActionRequest,
    options: Partial<AxiosRequestConfig> = {},
    pathname?: string,
  ): Promise<ActionResponse> {
    return this.request<ActionResponse>(
      {
        method: "POST",
        url: `${pathname}/actions/${actionRequest.action}`,
        data: actionRequest.params,
      },
      options,
    );
  }

  public delete(
    request: DeleteRequest,
    options: Partial<AxiosRequestConfig> = {},
    pathname?: string,
  ): Promise<DeleteResponse<T>> {
    return this.request<DeleteResponse<T>>(
      {
        method: "DELETE",
        url: pathname,
        data: request,
      },
      options,
    );
  }

  public forceDelete(
    request: DeleteRequest,
    options: Partial<AxiosRequestConfig> = {},
    pathname?: string,
  ): Promise<DeleteResponse<T>> {
    return this.request<DeleteResponse<T>>(
      {
        method: "DELETE",
        url: `$${pathname}/force`,
        data: request,
      },
      options,
    );
  }

  public restore(
    request: DeleteRequest,
    options: Partial<AxiosRequestConfig> = {},
    pathname?: string,
  ): Promise<DeleteResponse<T>> {
    return this.request<DeleteResponse<T>>(
      {
        method: "POST",
        url: `$${pathname}/restore`,
        data: request,
      },
      options,
    );
  }
}
