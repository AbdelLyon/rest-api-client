import "reflect-metadata";
import { Http } from "./Http";
import type { AxiosRequestConfig } from "axios";
import type { DeleteRequest, DeleteResponse } from "../types/delete";
import type { ActionRequest, ActionResponse } from "../types/action";
import type { MutateRequest, MutateResponse } from "../types/mutate";
import type { IMutation } from "./inerfaces";

export class Mutation<T> extends Http implements IMutation<T> {
  constructor(pathname: string) {
    super({
      baseURL: `/${pathname}`,
    });
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
