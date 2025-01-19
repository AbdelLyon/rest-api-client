import { AxiosInstance } from 'axios';
import { AxiosRequestConfig } from 'axios';

export declare interface ActionField {
    name: string;
    value: string | number | boolean;
}

export declare interface ActionFilter {
    field: string;
    value: boolean | string | number;
}

export declare interface ActionRequest {
    action: string;
    params: paramsAction;
}

export declare interface ActionResponse {
    data: {
        impacted: number;
    };
}

export declare interface Aggregate {
    relation: string;
    type: AggregateType;
    field?: string;
    filters?: Array<Filter>;
}

export declare type AggregateType = "min" | "max" | "avg" | "sum" | "count" | "exists";

export declare interface AttachRelation {
    operation: "attach";
    key: string | number;
}

export declare interface BaseFilter {
    field: string;
    operator: FilterOperator;
    value: string | number | boolean | Array<string | number | boolean>;
    type?: FilterType;
}

export declare interface BaseMutationOperation<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>> {
    attributes?: TAttributes;
    relations?: Partial<Record<keyof TRelations, RelationOperation<TAttributes, TRelations, TRelationAttributesMap> | Array<RelationOperation<TAttributes, TRelations, TRelationAttributesMap>>>>;
}

export declare interface CreateOperation<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>> extends BaseMutationOperation<TAttributes, TRelations, TRelationAttributesMap> {
    operation: "create";
}

export declare interface CreateRelation<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>> {
    operation: "create";
    attributes?: TRelationAttributesMap[keyof TRelations];
    relations?: Partial<Record<keyof TRelations, RelationOperation<TAttributes, TRelations, TRelationAttributesMap> | Array<RelationOperation<TAttributes, TRelations, TRelationAttributesMap>>>>;
}

export declare interface DeleteRequest {
    resources: Array<number | string>;
}

export declare interface DeleteResponse<T> {
    data: Array<T>;
    meta?: {
        gates?: {
            authorized_to_create?: boolean;
            [key: string]: boolean | undefined;
        };
    };
}

export declare interface DetachRelation {
    operation: "detach";
    key: string | number;
}

export declare interface DetailsAction {
    name: string;
    uriKey: string;
    fields: DetailsActionField;
    meta: DetailsActionMeta;
    is_standalone: boolean;
}

export declare interface DetailsActionField {
    [key: string]: Array<string>;
}

export declare interface DetailsActionMeta {
    [key: string]: unknown;
}

export declare interface DetailsInstruction {
    name: string;
    uriKey: string;
    fields: DetailsActionField;
    meta: DetailsActionMeta;
}

export declare interface DetailsRelation {
    resources: Array<string>;
    relation: string;
    constraints: DetailsRelationConstraints;
    name: string;
}

export declare interface DetailsRelationConstraints {
    required_on_creation: boolean;
    prohibited_on_creation: boolean;
    required_on_update: boolean;
    prohibited_on_update: boolean;
}

export declare interface DetailsResource {
    actions: Array<DetailsAction>;
    instructions: Array<DetailsInstruction>;
    fields: Array<string>;
    limits: Array<number>;
    scopes: Array<string>;
    relations: Array<DetailsRelation>;
    rules: DetailsValidationRules;
}

export declare interface DetailsResponse {
    data: DetailsResource;
}

export declare interface DetailsValidationRules {
    all?: Record<string, Array<string>>;
    create?: Record<string, Array<string>>;
    update?: Record<string, Array<string>>;
}

export declare type Filter = BaseFilter | NestedFilter;

export declare type FilterOperator = "=" | ">" | "<" | "in";

export declare type FilterType = "and" | "or";

export declare type Gate = "create" | "view" | "update" | "delete" | "restore" | "forceDelete";

export declare class HttpClient implements IHttpClient {
    private static instance?;
    private axiosInstance;
    private maxRetries;
    static init(options: HttpConfigOptions): HttpClient;
    static getInstance(): HttpClient;
    protected getAxiosInstance(): AxiosInstance;
    protected setAxiosInstance(instance: AxiosInstance): void;
    protected getFullBaseUrl(options: HttpConfigOptions): string;
    private createAxiosInstance;
    private setupInterceptors;
    private configureRetry;
    private isRetryableError;
    private handleErrorResponse;
    private logError;
    request<TResponse>(config: AxiosRequestConfig, options?: Partial<AxiosRequestConfig>): Promise<TResponse>;
    protected _setAxiosInstanceForTesting(axiosInstance: AxiosInstance): void;
}

export declare interface HttpConfigOptions {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    withCredentials?: boolean;
    maxRetries?: number;
}

export declare interface IHttpClient {
    request: <TResponse>(config: AxiosRequestConfig, options?: Partial<AxiosRequestConfig>) => Promise<TResponse>;
}

export declare interface IMutation<T> {
    mutate: <TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>>(mutateRequest: MutateRequest<TAttributes, TRelations, TRelationAttributesMap>) => Promise<MutateResponse<T>>;
    executeAction: (actionRequest: ActionRequest) => Promise<ActionResponse>;
    delete: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
    forceDelete: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
    restore: (request: DeleteRequest) => Promise<DeleteResponse<T>>;
}

export declare interface Include {
    relation: string;
    filters?: Array<Filter>;
    sorts?: Array<Sort>;
    selects?: Array<Select>;
    scopes?: Array<Scope>;
    limit?: number;
}

export declare interface Instruction {
    name: string;
    fields: Array<InstructionField>;
}

export declare interface InstructionField {
    name: string;
    value: string | number | boolean;
}

export declare interface IQuery<T> {
    search: (searchRequest: SearchRequest, options?: Partial<AxiosRequestConfig>) => Promise<Array<T>>;
    searchPaginate: (searchRequest: SearchRequest, options?: Partial<AxiosRequestConfig>) => Promise<SearchResponse<T>>;
    getdetails: (options?: Partial<AxiosRequestConfig>) => Promise<DetailsResponse>;
}

export declare interface MutateRequest<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>> {
    mutate: Array<MutationOperation<TAttributes, TRelations, TRelationAttributesMap>>;
}

export declare interface MutateResponse<T> {
    data: Array<T>;
}

export declare abstract class Mutation<T> implements IMutation<T> {
    protected http: HttpClient;
    protected pathname: string;
    constructor(pathname: string);
    mutate<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>>(mutateRequest: MutateRequest<TAttributes, TRelations, TRelationAttributesMap>, options?: Partial<AxiosRequestConfig>): Promise<MutateResponse<T>>;
    executeAction(actionRequest: ActionRequest, options?: Partial<AxiosRequestConfig>): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
}

export declare type MutationOperation<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>> = CreateOperation<TAttributes, TRelations, TRelationAttributesMap> | UpdateOperation<TAttributes, TRelations, TRelationAttributesMap>;

export declare interface NestedFilter {
    nested: Array<BaseFilter>;
}

export declare type OperationType = "create" | "update" | "attach" | "detach" | "sync" | "toggle";

export declare interface PaginationParams {
    page?: number;
    limit?: number;
}

declare interface paramsAction {
    fields: Array<ActionField>;
    search?: {
        filters?: Array<ActionFilter>;
    };
}

export declare abstract class Query<T> implements IQuery<T> {
    protected http: HttpClient;
    protected pathname: string;
    constructor(pathname: string);
    private searchRequest;
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<Array<T>>;
    searchPaginate(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
    getdetails(options?: Partial<AxiosRequestConfig>): Promise<DetailsResponse>;
}

export declare type RelationOperation<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>> = CreateRelation<TAttributes, TRelations, TRelationAttributesMap> | AttachRelation | DetachRelation | SyncRelation<TRelationAttributesMap[keyof TRelations]> | ToggleRelation<TRelationAttributesMap[keyof TRelations]>;

export declare interface Scope {
    name: string;
    parameters: Array<ScopeParameter>;
}

export declare type ScopeParameter = string | number | boolean;

export declare interface SearchRequest {
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

export declare interface SearchResponse<T> {
    data: Array<T>;
    meta?: {
        page: number;
        perPage: number;
        total: number;
    };
}

export declare interface SearchText {
    value: string;
}

export declare interface Select {
    field: string;
}

export declare interface Sort {
    field: string;
    direction: SortDirection;
}

export declare type SortDirection = "asc" | "desc";

export declare interface SyncRelation<TRelationAttributes> {
    operation: "sync";
    without_detaching?: boolean;
    key: string | number;
    attributes?: TRelationAttributes;
    pivot?: Record<string, string | number>;
}

export declare interface ToggleRelation<TRelationAttributes> {
    operation: "toggle";
    key: string | number;
    attributes?: TRelationAttributes;
    pivot?: Record<string, string | number>;
}

export declare interface UpdateOperation<TAttributes, TRelations, TRelationAttributesMap extends Record<keyof TRelations, unknown>> extends BaseMutationOperation<TAttributes, TRelations, TRelationAttributesMap> {
    operation: "update";
    key: string | number;
}

export { }
