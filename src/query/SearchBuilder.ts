import { RequestConfig } from "@/http";
import type {
  SearchRequest,
  PaginatedSearchRequest,
  ScopeParameterValue,
  ComparisonOperator,
  LogicalOperator,
  SortDirection,
  AggregationFunction,
  SearchPermission,
  Filter,
  FilterCriteria,
  SortCriteria,
  FieldSelection,
  InstructionField,
  RelationInclude,
  FilterValue,
  IQuery,
} from "./types";

type ExtractKeys<T> = keyof T & string;
type ExtractRelationKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [K in keyof T]: T[K] extends Array<infer _>
    ? K & string
    : T[K] extends object
      ? K & string
      : never;
}[keyof T] &
  string;

type ValueType<T, K extends keyof T> =
  T[K] extends Array<infer U>
    ? U | U[]
    : T[K] extends (infer V)[]
      ? V | V[]
      : T[K];

export class SearchBuilder<T> {
  private searchRequest: SearchRequest = {};
  private queryInstance?: IQuery<T>;

  public withText(value: string): this {
    this.searchRequest.text = { value };
    return this;
  }

  public withScope(
    name: string,
    parameters: Array<ScopeParameterValue> = [],
  ): this {
    if (!this.searchRequest.scopes) {
      this.searchRequest.scopes = [];
    }
    this.searchRequest.scopes.push({ name, parameters });
    return this;
  }

  public withFilter<K extends ExtractKeys<T>>(
    field: K,
    operator: ComparisonOperator,
    value: ValueType<T, K>,
    type?: LogicalOperator,
  ): this {
    if (!this.searchRequest.filters) {
      this.searchRequest.filters = [];
    }
    this.searchRequest.filters.push({
      field,
      operator,
      value: value as FilterValue,
      type,
    });
    return this;
  }

  public withNestedFilters(filters: Array<FilterCriteria>): this {
    if (!this.searchRequest.filters) {
      this.searchRequest.filters = [];
    }
    this.searchRequest.filters.push({ nested: filters });
    return this;
  }

  public withSort<K extends ExtractKeys<T>>(
    field: K,
    direction: SortDirection = "asc",
  ): this {
    if (!this.searchRequest.sorts) {
      this.searchRequest.sorts = [];
    }
    this.searchRequest.sorts.push({ field, direction });
    return this;
  }

  public withSelect<K extends ExtractKeys<T>>(field: K): this {
    if (!this.searchRequest.selects) {
      this.searchRequest.selects = [];
    }
    this.searchRequest.selects.push({ field });
    return this;
  }

  public withInclude<K extends ExtractRelationKeys<T>>(
    relation: K,
    options: {
      filters?: Array<Filter>;
      sorts?: Array<SortCriteria>;
      selects?: Array<FieldSelection>;
      scopes?: Array<{ name: string; parameters: Array<ScopeParameterValue> }>;
      limit?: number;
    } = {},
  ): this {
    if (!this.searchRequest.includes) {
      this.searchRequest.includes = [];
    }
    const include: RelationInclude = {
      relation,
      ...options,
    };
    this.searchRequest.includes.push(include);
    return this;
  }

  // Aggregations avec typage strict
  public withAggregate<K extends ExtractRelationKeys<T>>(
    relation: K,
    type: AggregationFunction,
    field?: string,
    filters?: Array<Filter>,
  ): this {
    if (!this.searchRequest.aggregates) {
      this.searchRequest.aggregates = [];
    }
    this.searchRequest.aggregates.push({ relation, type, field, filters });
    return this;
  }

  public withInstruction(name: string, fields: Array<InstructionField>): this {
    if (!this.searchRequest.instructions) {
      this.searchRequest.instructions = [];
    }
    this.searchRequest.instructions.push({ name, fields });
    return this;
  }

  public withGate(permission: SearchPermission): this {
    if (!this.searchRequest.Gates) {
      this.searchRequest.Gates = [];
    }
    this.searchRequest.Gates.push(permission);
    return this;
  }

  public withPagination(page: number, limit: number): this {
    (this.searchRequest as PaginatedSearchRequest).page = page;
    (this.searchRequest as PaginatedSearchRequest).limit = limit;
    return this;
  }

  public async search<TResponse = Array<T>>(
    options: Partial<RequestConfig> = {},
  ): Promise<TResponse> {
    if (!this.queryInstance) {
      throw new Error("No query instance provided to execute the search");
    }
    return await this.queryInstance.search<TResponse>(this.build(), options);
  }

  public build(): SearchRequest | PaginatedSearchRequest {
    return this.searchRequest;
  }
}
