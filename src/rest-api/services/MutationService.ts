// MutationService.ts
import { ApiService } from "./ApiService";
import type { ActionRequest, ActionResponse } from "../interfaces/action";
import type { MutateRequest, MutateResponse } from "../interfaces/mutate";
import type { AxiosRequestConfig } from "axios";

export interface IMutationService<T> {
  mutate: <TAttributes, TRelations>(
    mutateRequest: MutateRequest<TAttributes, TRelations>,
  ) => Promise<MutateResponse<T>>;
  executeAction: (actionRequest: ActionRequest) => Promise<ActionResponse>;
}

export abstract class MutationService<T>
  extends ApiService
  implements IMutationService<T>
{
  protected constructor(domain: string, pathname: string) {
    super(domain, pathname);
  }

  public mutate<TAttributes, TRelations>(
    mutateRequest: MutateRequest<TAttributes, TRelations>,
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
}
