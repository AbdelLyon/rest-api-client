import { z } from "zod";
import { HttpClient } from "./HttpClient";
import type { DeleteRequest, DeleteResponse } from "@/types/delete";
import type { ActionRequest, ActionResponse } from "@/types/action";
import type { MutationRequest, MutationResponse } from "@/types/mutate";
import type { IMutation } from "@/interfaces";
import type { RequestConfig } from "@/types/common";

export abstract class Mutation<T> implements IMutation<T> {
  protected http: HttpClient;
  protected pathname: string;
  protected schema: z.ZodType<T>;

  constructor (pathname: string, schema: z.ZodType<T>) {
    this.http = HttpClient.getInstance();
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

  public async mutate<TAttributes, TRelations>
    (
      mutateRequest: MutationRequest<TAttributes, TRelations>,
      options?: Partial<RequestConfig>
    ): Promise<MutationResponse<T>> {
    const response = await this.http.request<MutationResponse<T>>(
      {
        method: "POST",
        url: `${this.pathname}/mutate`,
        data: mutateRequest,
      },
      options,
    );

    return {
      ...response,
      data: this.validateData(response.data),
    };
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
