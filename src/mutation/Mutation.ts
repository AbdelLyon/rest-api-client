import type { z } from "zod";
import type { DeleteRequest, DeleteResponse } from "@/mutation/types/delete";
import type { ActionRequest, ActionResponse } from "@/mutation/types/action";
import type { BuildOnly, MutationResponse } from "@/mutation/types/mutation";
import type { RequestConfig } from "@/http/types/http";
import type { IRelationBuilder } from "@/mutation/interface/IRelationBuilder";
import type { IMutation } from "@/mutation/interface/IMutation";
import type { IEntityBuilder } from "@/mutation/interface/IEntityBuilder";
import type { BaseHttp } from "@/http/shared/BaseHttp";
import { Builder } from "@/mutation/Builder";
import { HttpCLient } from "@/http/HttpClient";

export abstract class Mutation<T> implements IMutation<T> {
  protected http: BaseHttp;
  protected pathname: string;
  protected schema: z.ZodType<T>;

  private readonly relation: IRelationBuilder;

  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  ) {
    this.http = HttpCLient.getInstance(httpInstanceName);
    this.pathname = pathname;
    this.schema = schema;

    this.relation = Builder.getRelationBuilder();
  }

  public entityBuilder(): IEntityBuilder<T> {
    const builder = Builder.createEntityBuilder<T>(this.relation);
    builder.setMutationFunction((data, options) => this.mutate(data, options));
    return builder;
  }

  public relationBuilder(): IRelationBuilder {
    return this.relation;
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
    mutateRequest: BuildOnly<T> | { mutate: Array<any> },
    options?: Partial<RequestConfig>,
  ): Promise<MutationResponse> {
    const data =
      "build" in mutateRequest ? mutateRequest.build() : mutateRequest;

    const response = await this.http.request<MutationResponse>(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data,
      },
      options,
    );

    return response;
  }

  public executeAction(
    actionRequest: ActionRequest,
    options: Partial<RequestConfig> = {},
  ): Promise<ActionResponse> {
    return this.http.request<ActionResponse>(
      {
        method: "POST",
        url: `${this.pathname}/actions/${actionRequest.action}`,
        data: actionRequest.payload,
      },
      options,
    );
  }

  public async delete(
    request: DeleteRequest,
    options: Partial<RequestConfig> = {},
  ): Promise<DeleteResponse<T>> {
    const response = await this.http.request<DeleteResponse<T>>(
      {
        method: "DELETE",
        url: this.pathname,
        data: request,
      },
      options,
    );

    return {
      ...response,
      data: this.validateData(response.data),
    };
  }

  public async forceDelete(
    request: DeleteRequest,
    options: Partial<RequestConfig> = {},
  ): Promise<DeleteResponse<T>> {
    const response = await this.http.request<DeleteResponse<T>>(
      {
        method: "DELETE",
        url: `${this.pathname}/force`,
        data: request,
      },
      options,
    );

    return {
      ...response,
      data: this.validateData(response.data),
    };
  }

  public async restore(
    request: DeleteRequest,
    options: Partial<RequestConfig> = {},
  ): Promise<DeleteResponse<T>> {
    const response = await this.http.request<DeleteResponse<T>>(
      {
        method: "POST",
        url: `${this.pathname}/restore`,
        data: request,
      },
      options,
    );

    return {
      ...response,
      data: this.validateData(response.data),
    };
  }
}
