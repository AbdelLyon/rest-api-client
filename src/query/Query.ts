import type { HttpRequest } from "../http/request/HttpRequest";
import type {
  DetailsResponse,
  IQuery,
  PaginatedSearchRequest,
  SearchRequest,
  SearchResponse,
  ComparisonOperator,
} from "./types";
import type { z } from "zod";
import { SearchBuilder } from "./SearchBuilder";
import { DetailsBuilder } from "./DetailsBuilder";
import { HttpClient } from "@/http";

type ExtractKeys<T> = keyof T & string;

type ValueForField<T, K extends keyof T> =
  T[K] extends Array<infer U>
    ? U | U[]
    : T[K] extends (infer V)[]
      ? V | V[]
      : T[K];

export abstract class Query<T> implements IQuery<T> {
  protected http: HttpRequest;
  protected pathname: string;
  protected schema: z.ZodType<T>;

  constructor(
    pathname: string,
    schema: z.ZodType<T>,
    httpInstanceName?: string,
  ) {
    this.http = HttpClient.getInstance(httpInstanceName);
    this.pathname = pathname;
    this.schema = schema;
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

  private searchRequest(search: SearchRequest): Promise<SearchResponse<T>> {
    return this.http.request<SearchResponse<T>>({
      method: "POST",
      url: `${this.pathname}/search`,
      data: { search },
    });
  }

  public async search<TResponse = Array<T>>(
    search: SearchRequest | PaginatedSearchRequest,
  ): Promise<TResponse> {
    const response = await this.searchRequest(search);
    const validatedData = this.validateData(response.data);

    const isPaginated = "page" in search || "limit" in search;

    if (isPaginated) {
      return {
        ...response,
        data: validatedData,
      } as unknown as TResponse;
    }
    return validatedData as unknown as TResponse;
  }

  public createSearchBuilder<U extends T = T>(): SearchBuilder<U> {
    return new SearchBuilder<U>();
  }

  public async executeSearch<TResponse = Array<T>>(
    builder: SearchBuilder<T>,
  ): Promise<TResponse> {
    return await this.search<TResponse>(builder.build());
  }

  public async searchByText<TResponse = Array<T>>(
    text: string,
    page?: number,
    limit?: number,
  ): Promise<TResponse> {
    const builder = this.createSearchBuilder().withText(text);

    if (page !== undefined && limit !== undefined) {
      builder.withPagination(page, limit);
    }

    return this.executeSearch<TResponse>(builder);
  }

  public async searchByField<K extends ExtractKeys<T>, TResponse = Array<T>>(
    field: K,
    operator: ComparisonOperator,
    value: ValueForField<T, K>,
  ): Promise<TResponse> {
    const builder = this.createSearchBuilder().withFilter(
      field,
      operator,
      value,
    );
    return this.executeSearch<TResponse>(builder);
  }

  public createDetailsBuilder<U extends T = T>(): DetailsBuilder<U> {
    return new DetailsBuilder<U>(this as IQuery<U>);
  }

  public details(): Promise<DetailsResponse> {
    return this.http.request<DetailsResponse>({
      method: "GET",
      url: this.pathname,
    });
  }
}
