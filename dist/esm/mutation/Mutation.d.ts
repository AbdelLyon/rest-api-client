import {
  ActionRequest,
  ActionResponse,
  BuildOnly,
  DeleteRequest,
  DeleteResponse,
  IModel,
  IMutation,
  IRelation,
  MutationResponse,
} from "./types.js";
import { z } from "zod";
import { RequestConfig } from "../http/types.js";
import { Request } from "../http/Request/Request.js";
export declare abstract class Mutation<T> implements IMutation<T> {
  protected http: Request;
  protected pathname: string;
  protected schema: z.ZodType<T>;
  private readonly relation;
  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  );
  builderModel(): IModel<T>;
  builderRelation(): IRelation;
  private validateData;
  mutate(
    mutateRequest:
      | BuildOnly<T>
      | {
          mutate: Array<any>;
        },
    options?: Partial<RequestConfig>,
  ): Promise<MutationResponse>;
  action(
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
