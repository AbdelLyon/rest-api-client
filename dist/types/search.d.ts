export type ScopeParameter = string | number | boolean;
export type FilterOperator = "=" | ">" | "<" | "in";
export type FilterType = "and" | "or";
export type SortDirection = "asc" | "desc";
export type AggregateType = "min" | "max" | "avg" | "sum" | "count" | "exists";
export type Gate = "create" | "view" | "update" | "delete" | "restore" | "forceDelete";
export interface SearchText {
    value: string;
}
export interface Scope {
    name: string;
    parameters: Array<ScopeParameter>;
}
export interface BaseFilter {
    field: string;
    operator: FilterOperator;
    value: string | number | boolean | Array<string | number | boolean>;
    type?: FilterType;
}
export interface NestedFilter {
    nested: Array<BaseFilter>;
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
    fields: Array<InstructionField>;
}
export interface Include {
    relation: string;
    filters?: Array<Filter>;
    sorts?: Array<Sort>;
    selects?: Array<Select>;
    scopes?: Array<Scope>;
    limit?: number;
}
export interface Aggregate {
    relation: string;
    type: AggregateType;
    field?: string;
    filters?: Array<Filter>;
}
export interface SearchRequest {
    text?: SearchText;
    scopes?: Array<Scope>;
    filters?: Array<Filter>;
    sorts?: Array<Sort>;
    selects?: Array<Select>;
    includes?: Array<Include>;
    aggregates?: Array<Aggregate>;
    instructions?: Array<Instruction>;
    gates?: Array<Gate>;
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
