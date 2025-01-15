// MutationService.ts
import { ApiService } from "./ApiService";
import type { DeleteRequest, DeleteResponse } from "../interfaces/delete";
import type { ActionRequest, ActionResponse } from "../interfaces/action";
import type { MutateRequest, MutateResponse } from "../interfaces/mutate";
import type { AxiosRequestConfig } from "axios";

export interface IMutationService<T> {
  mutate: <
    TAttributes,
    TRelations,
    TRelationAttributesMap extends Record<keyof TRelations, unknown>,
  >(
    mutateRequest: MutateRequest<
      TAttributes,
      TRelations,
      TRelationAttributesMap
    >,
  ) => Promise<MutateResponse<T>>;
  executeAction: (actionRequest: ActionRequest) => Promise<ActionResponse>;
  delete: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
  forceDelete: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
  restore: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
}

export abstract class MutationService<T>
  extends ApiService
  implements IMutationService<T>
{
  public constructor(domain: string, pathname: string) {
    super(domain, pathname);
  }

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
  ): Promise<MutateResponse<T>> {
    return this.request<MutateResponse<T>>(
      {
        method: "POST",
        url: "/mutate",
        data: mutateRequest,
      },
      options,
    );
  }

  public executeAction(
    actionRequest: ActionRequest,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<ActionResponse> {
    return this.request<ActionResponse>(
      {
        method: "POST",
        url: `/actions/${actionRequest.action}`,
        data: actionRequest.params,
      },
      options,
    );
  }

  public delete(
    request: DeleteRequest,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<DeleteResponse<T>> {
    return this.request<DeleteResponse<T>>(
      {
        method: "DELETE",
        url: "",
        data: request,
      },
      options,
    );
  }

  public forceDelete(
    request: DeleteRequest,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<DeleteResponse<T>> {
    return this.request<DeleteResponse<T>>(
      {
        method: "DELETE",
        url: "/force",
        data: request,
      },
      options,
    );
  }

  public restore(
    request: DeleteRequest,
    options: Partial<AxiosRequestConfig> = {},
  ): Promise<DeleteResponse<T>> {
    return this.request<DeleteResponse<T>>(
      {
        method: "POST",
        url: "/restore",
        data: request,
      },
      options,
    );
  }
}
