import {
  ActionRequest,
  ActionResponse,
  BuildOnly,
  DeleteRequest,
  DeleteResponse,
  IModel,
  IMutation,
  IRelation,
  MutationRequest,
  MutationResponse,
} from "./types.js";
import { z } from "zod";
import { RequestConfig } from "../http/types.js";
import { HttpRequest } from "../http/Request/HttpRequest.js";
export declare abstract class Mutation<T> implements IMutation<T> {
  protected http: HttpRequest;
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
    mutateRequest: BuildOnly<T> | MutationRequest<T, Record<string, unknown>>,
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
