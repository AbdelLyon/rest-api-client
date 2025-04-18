// Mutation.ts
import { z } from "zod";
import { HttpClient } from "./HttpClient";
import type { DeleteRequest, DeleteResponse } from "@/types/delete";
import type { ActionRequest, ActionResponse } from "@/types/action";
import type { MutationResponse } from "@/types/mutate";
import type { IMutation } from "@/interfaces";
import type { RequestConfig } from "@/types/common";
import { Builder, BuildOnly, IBuilder } from "./MutateRequestBuilder";

export abstract class Mutation<T> implements IMutation<T> {
  protected http: HttpClient;
  public builder: IBuilder<T>;

  protected pathname: string;
  protected schema: z.ZodType<T>;

  constructor (pathname: string, schema: z.ZodType<T>) {
    this.http = HttpClient.getInstance();
    this.builder = Builder.createBuilder<T>();

    // Injecter la fonction de mutation sans créer de référence circulaire
    this.builder.setMutationFunction((data, options) => this.mutate(data, options));

    this.pathname = pathname;
    this.schema = schema;
  }

  private validateData(data: unknown[]): T[] {
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
    mutateRequest: BuildOnly<T>,
    options?: Partial<RequestConfig>
  ): Promise<MutationResponse> {
    const data = 'build' in mutateRequest ? mutateRequest.build() : mutateRequest;

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