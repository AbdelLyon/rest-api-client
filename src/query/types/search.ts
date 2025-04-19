// Types simples
export type ScopeParameterValue = string | number | boolean;
export type ComparisonOperator = "=" | ">" | "<" | "in";
export type LogicalOperator = "and" | "or";
export type SortDirection = "asc" | "desc";
export type AggregationFunction =
  | "min"
  | "max"
  | "avg"
  | "sum"
  | "count"
  | "exists";
export type SearchPermission =
  | "create"
  | "view"
  | "update"
  | "delete"
  | "restore"
  | "forceDelete";

export interface TextSearch {
  value: string;
}

export interface ScopeDefinition {
  name: string;
  parameters: Array<ScopeParameterValue>;
}

export interface FilterCriteria {
  field: string;
  operator: ComparisonOperator;
  value: string | number | boolean | Array<string | number | boolean>;
  type?: LogicalOperator;
}

export interface NestedFilterCriteria {
  nested: Array<FilterCriteria>;
}

export type Filter = FilterCriteria | NestedFilterCriteria;

export interface SortCriteria {
  field: string;
  direction: SortDirection;
}

export interface FieldSelection {
  field: string;
}

export interface InstructionField {
  name: string;
  value: string | number | boolean;
}

export interface Instruction {
  name: string;
  fields: Array<InstructionField>;
}

export interface RelationInclude {
  relation: string;
  filters?: Array<Filter>;
  sorts?: Array<SortCriteria>;
  selects?: Array<FieldSelection>;
  scopes?: Array<ScopeDefinition>;
  limit?: number;
}

export interface AggregationCriteria {
  relation: string;
  type: AggregationFunction;
  field?: string;
  filters?: Array<Filter>;
}

export interface SearchRequest {
  text?: TextSearch;
  scopes?: Array<ScopeDefinition>;
  filters?: Array<Filter>;
  sorts?: Array<SortCriteria>;
  selects?: Array<FieldSelection>;
  includes?: Array<RelationInclude>;
  aggregates?: Array<AggregationCriteria>;
  instructions?: Array<Instruction>;
  Gates?: Array<SearchPermission>;
}

export interface PaginatedSearchRequest extends SearchRequest {
  page?: number;
  limit?: number;
}

export interface SearchResponse<T> {
  data: Array<T>;
  meta?: {
    page: number;
    perPage: number;
    total: number;
  };
}
