import { z } from "zod";
import { DeleteRequest, DeleteResponse } from "./types/delete.js";
import { ActionRequest, ActionResponse } from "./types/action.js";
import { BuildOnly, MutationResponse } from "./types/mutation.js";
import { RequestConfig } from "../http/types/http.js";
import { IRelationBuilder } from "./interface/IRelationBuilder.js";
import { IMutation } from "./interface/IMutation.js";
import { IEntityBuilder } from "./interface/IEntityBuilder.js";
import { BaseHttp } from "../http/shared/BaseHttp.js";
export declare abstract class Mutation<T> implements IMutation<T> {
  protected http: BaseHttp;
  protected pathname: string;
  protected schema: z.ZodType<T>;
  private readonly relation;
  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  );
  entityBuilder(): IEntityBuilder<T>;
  relationBuilder(): IRelationBuilder;
  private validateData;
  mutate(
    mutateRequest:
      | BuildOnly<T>
      | {
          mutate: Array<any>;
        },
    options?: Partial<RequestConfig>,
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
