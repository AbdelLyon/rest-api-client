import { RequestConfig } from "../http.js";
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
export interface DetailsActionField {
  [key: string]: Array<string>;
}
export interface DetailsActionMeta {
  [key: string]: unknown;
}
export interface DetailsAction {
  name: string;
  uriKey: string;
  fields: DetailsActionField;
  meta: DetailsActionMeta;
  is_standalone: boolean;
}
export interface DetailsInstruction {
  name: string;
  uriKey: string;
  fields: DetailsActionField;
  meta: DetailsActionMeta;
}
export interface DetailsRelationConstraints {
  required_on_creation: boolean;
  prohibited_on_creation: boolean;
  required_on_update: boolean;
  prohibited_on_update: boolean;
}
export interface DetailsRelation {
  resources: Array<string>;
  relation: string;
  constraints: DetailsRelationConstraints;
  name: string;
}
export interface DetailsValidationRules {
  all?: Record<string, Array<string>>;
  create?: Record<string, Array<string>>;
  update?: Record<string, Array<string>>;
}
export interface DetailsResource {
  actions: Array<DetailsAction>;
  instructions: Array<DetailsInstruction>;
  fields: Array<string>;
  limits: Array<number>;
  scopes: Array<string>;
  relations: Array<DetailsRelation>;
  rules: DetailsValidationRules;
}
export interface DetailsResponse {
  data: DetailsResource;
}
export interface IQuery<T> {
  search: <TResponse = Array<T>>(
    search: SearchRequest | PaginatedSearchRequest,
    options: Partial<RequestConfig>,
  ) => Promise<TResponse>;
  details: (options?: Partial<RequestConfig>) => Promise<DetailsResponse>;
}
