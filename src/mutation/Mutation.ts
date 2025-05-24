import type { z } from "zod";
import type { HttpRequest } from "@/http/Request/HttpRequest";
import { HttpClient } from "@/http/HttpClient";
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
} from "./types";
import { Builder } from "./builder/Builder";
import { Relation } from "./builder/Relation";

export abstract class Mutation<T> implements IMutation<T> {
  protected http: HttpRequest;
  protected pathname: string;
  protected schema: z.ZodType<T>;
  private readonly _relation: IRelation;

  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  ) {
    this.http = HttpClient.getInstance(httpInstanceName);
    this.pathname = pathname;
    this.schema = schema;
    this._relation = Relation.getInstance();
    this._relation.setContext("update");
  }

  get model(): IModel<T> {
    const builder = Builder.create<T>();
    builder.setMutationFunction((data) => this.mutate(data));
    return builder;
  }

  get relation(): IRelation {
    return this._relation;
  }

  private validateData(data: Array<unknown>): Array<T> {
    return data.map((item) => {
      const result = this.schema.safeParse(item);
      if (!result.success) {
        console.error("Type validation failed:", result.error.errors);
        throw new Error(
          `Type validation failed: ${JSON.stringify(result.error.errors)}`,
        );
      }
      return result.data;
    });
  }

  public async mutate(
    mutateRequest:
      | BuilderWithCreationContext<T>
      | BuilderWithUpdateContext<T>
      | MutationRequest<T, Record<string, unknown>>,
  ): Promise<MutationResponse> {
    const data =
      "build" in mutateRequest ? mutateRequest.build() : mutateRequest;

    const response = await this.http.request<MutationResponse>({
      method: "POST",
      url: `${this.pathname}/mutate`,
      data,
    });

    return response;
  }

  public action(actionRequest: ActionRequest): Promise<ActionResponse> {
    return this.http.request<ActionResponse>({
      method: "POST",
      url: `${this.pathname}/actions/${actionRequest.action}`,
      data: actionRequest.payload,
    });
  }

  public async delete(request: DeleteRequest): Promise<DeleteResponse<T>> {
    const response = await this.http.request<DeleteResponse<T>>({
      method: "DELETE",
      url: this.pathname,
      data: request,
    });

    return {
      ...response,
      data: this.validateData(response.data),
    };
  }

  public async forceDelete(request: DeleteRequest): Promise<DeleteResponse<T>> {
    const response = await this.http.request<DeleteResponse<T>>({
      method: "DELETE",
      url: `${this.pathname}/force`,
      data: request,
    });

    return {
      ...response,
      data: this.validateData(response.data),
    };
  }

  public async restore(request: DeleteRequest): Promise<DeleteResponse<T>> {
    const response = await this.http.request<DeleteResponse<T>>({
      method: "POST",
      url: `${this.pathname}/restore`,
      data: request,
    });

    return {
      ...response,
      data: this.validateData(response.data),
    };
  }
}
