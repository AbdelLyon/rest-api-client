export type ScopeParameter = string | number | boolean;
export type FilterOperator = "=" | ">" | "<" | "in";
export type FilterType = "and" | "or";
export type SortDirection = "asc" | "desc";
export type AggregateType = "min" | "max" | "avg" | "sum" | "count" | "exists";
export type Gate =
  | "create"
  | "view"
  | "update"
  | "delete"
  | "restore"
  | "forceDelete";

export interface SearchText {
  value: string;
}

export interface Scope {
  name: string;
  parameters: ScopeParameter[];
}

export interface BaseFilter {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | Array<string | number | boolean>;
  type?: FilterType;
}

export interface NestedFilter {
  nested: BaseFilter[];
}

export type Filter = BaseFilter | NestedFilter;

export interface Sort {
  field: string;
  direction: SortDirection;
}

export interface Select {
  field: string;
}

export interface InstructionField {
  name: string;
  value: string | number | boolean;
}

export interface Instruction {
  name: string;
  fields: InstructionField[];
}

export interface Include {
  relation: string;
  filters?: Filter[];
  sorts?: Sort[];
  selects?: Select[];
  scopes?: Scope[];
  limit?: number;
}

export interface Aggregate {
  relation: string;
  type: AggregateType;
  field?: string;
  filters?: Filter[];
}

export interface SearchRequest {
  search: {
    text?: SearchText;
    scopes?: Scope[];
    filters?: Filter[];
    sorts?: Sort[];
    selects?: Select[];
    includes?: Include[];
    aggregates?: Aggregate[];
    instructions?: Instruction[];
    gates?: Gate[];
    page?: number;
    limit?: number;
  };
}

export interface SearchResponse<T> {
  data: T[];
  meta?: {
    page: number;
    perPage: number;
    total: number;
  };
}
