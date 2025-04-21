import { z } from "zod";
import { RequestConfig } from "../http/types.js";
import { HttpRequest } from "../http/Request/HttpRequest.js";
import {
  ActionRequest,
  ActionResponse,
  BuilderWithCreationContext,
  BuilderWithUpdateContext,
  DeleteRequest,
  DeleteResponse,
  IModel,
  IMutation,
  IRelation,
  MutationRequest,
  MutationResponse,
} from "./types.js";
export declare abstract class Mutation<T> implements IMutation<T> {
  protected http: HttpRequest;
  protected pathname: string;
  protected schema: z.ZodType<T>;
  private readonly _relation;
  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  );
  get model(): IModel<T>;
  get relation(): IRelation;
  private validateData;
  mutate(
    mutateRequest:
      | BuilderWithCreationContext<T>
      | BuilderWithUpdateContext<T>
      | MutationRequest<T, Record<string, unknown>>,
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
