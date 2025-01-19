import { AxiosInstance } from 'axios';
import { AxiosRequestConfig } from 'axios';

export declare interface ActionFieldDefinition {
    name: string;
    value: string | number | boolean;
}

export declare interface ActionFilterCriteria {
    field: string;
    value: boolean | string | number;
}

export declare interface ActionPayload {
    fields: Array<ActionFieldDefinition>;
    search?: {
        filters?: Array<ActionFilterCriteria>;
    };
}

export declare interface ActionRequest {
    action: string;
    payload: ActionPayload;
}

export declare interface ActionResponse {
    data: {
        impacted: number;
    };
}

export declare interface AggregationCriteria {
    relation: string;
    type: AggregationFunction;
    field?: string;
    filters?: Array<Filter>;
}

export declare type AggregationFunction = "min" | "max" | "avg" | "sum" | "count" | "exists";

export declare interface AttachRelationOperation {
    operation: "attach";
    key: string | number;
}

export declare interface BaseMutationData<TModelAttributes, TRelations> {
    attributes?: TModelAttributes;
    relations?: Partial<Record<keyof TRelations, RelationOperation<TModelAttributes, TRelations> | Array<RelationOperation<TModelAttributes, TRelations>>>>;
}

export declare type ComparisonOperator = "=" | ">" | "<" | "in";

export declare interface CreateMutationOperation<TModelAttributes, TRelations> extends BaseMutationData<TModelAttributes, TRelations> {
    operation: "create";
}

export declare interface CreateRelationOperation<TModelAttributes, TRelations> {
    operation: "create";
    attributes?: TRelations[keyof TRelations];
    relations?: Partial<Record<keyof TRelations, RelationOperation<TModelAttributes, TRelations> | Array<RelationOperation<TModelAttributes, TRelations>>>>;
}

export declare interface DeleteRequest {
    resources: Array<number | string>;
}

export declare interface DeleteResponse<T> {
    data: Array<T>;
    meta?: {
        gates?: Partial<Permission>;
    };
}

export declare interface DetachRelationOperation {
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

export declare interface FieldSelection {
    field: string;
}

export declare type Filter = FilterCriteria | NestedFilterCriteria;

export declare interface FilterCriteria {
    field: string;
    operator: ComparisonOperator;
    value: string | number | boolean | Array<string | number | boolean>;
    type?: LogicalOperator;
}

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
    mutate<TAttributes, TRelations>(mutateRequest: MutationRequest<TAttributes, TRelations>, options?: Partial<AxiosRequestConfig>): Promise<MutationResponse<T>>;
    executeAction(actionRequest: ActionRequest, options?: Partial<AxiosRequestConfig>): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
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

export declare type LogicalOperator = "and" | "or";

export declare abstract class Mutation<T> implements IMutation<T> {
    protected http: HttpClient;
    protected pathname: string;
    constructor(pathname: string);
    mutate<TAttributes, TRelations>(mutateRequest: MutationRequest<TAttributes, TRelations>, options?: Partial<AxiosRequestConfig>): Promise<MutationResponse<T>>;
    executeAction(actionRequest: ActionRequest, options?: Partial<AxiosRequestConfig>): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<AxiosRequestConfig>): Promise<DeleteResponse<T>>;
}

export declare type MutationOperation<TModelAttributes, TRelations> = CreateMutationOperation<TModelAttributes, TRelations> | UpdateMutationOperation<TModelAttributes, TRelations>;

export declare interface MutationRequest<TModelAttributes, TRelations> {
    mutate: Array<MutationOperation<TModelAttributes, TRelations>>;
}

export declare interface MutationResponse<TModel> {
    data: Array<TModel>;
}

export declare interface NestedFilterCriteria {
    nested: Array<FilterCriteria>;
}

export declare interface PaginatedSearchRequest extends SearchRequest {
    page?: number;
    limit?: number;
}

export declare interface PaginationParams {
    page?: number;
    limit?: number;
}

export declare interface Permission {
    authorized_to_view: boolean;
    authorized_to_create: boolean;
    authorized_to_update: boolean;
    authorized_to_delete: boolean;
    authorized_to_restore: boolean;
    authorized_to_force_delete: boolean;
}

export declare abstract class Query<T> implements IQuery<T> {
    protected http: HttpClient;
    protected pathname: string;
    constructor(pathname: string);
    private searchRequest;
    search(search: SearchRequest, options?: Partial<AxiosRequestConfig>): Promise<Array<T>>;
    searchPaginate(search: PaginatedSearchRequest, options?: Partial<AxiosRequestConfig>): Promise<SearchResponse<T>>;
    getdetails(options?: Partial<AxiosRequestConfig>): Promise<DetailsResponse>;
}

export declare type RelationAttributes<T> = {
    [K in keyof T]: T[K];
};

export declare type RelationDefinitions = Record<string, unknown>;

export declare interface RelationInclude {
    relation: string;
    filters?: Array<Filter>;
    sorts?: Array<SortCriteria>;
    selects?: Array<FieldSelection>;
    scopes?: Array<ScopeDefinition>;
    limit?: number;
}

export declare type RelationOperation<TModelAttributes, TRelations> = CreateRelationOperation<TModelAttributes, TRelations> | AttachRelationOperation | DetachRelationOperation | SyncRelationOperation<TRelations, keyof TRelations> | ToggleRelationOperation<TRelations, keyof TRelations>;

export declare type RelationOperationType = "create" | "update" | "attach" | "detach" | "sync" | "toggle";

export declare interface ScopeDefinition {
    name: string;
    parameters: Array<ScopeParameterValue>;
}

export declare type ScopeParameterValue = string | number | boolean;

export declare type SearchPermission = "create" | "view" | "update" | "delete" | "restore" | "forceDelete";

export declare interface SearchRequest {
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

export declare interface SearchResponse<T> {
    data: Array<T>;
    meta?: {
        page: number;
        perPage: number;
        total: number;
    };
}

export declare interface SortCriteria {
    field: string;
    direction: SortDirection;
}

export declare type SortDirection = "asc" | "desc";

export declare interface SyncRelationOperation<T, K extends keyof T> {
    operation: "sync";
    without_detaching?: boolean;
    key: string | number;
    attributes?: T[K];
    pivot?: Record<string, string | number>;
}

export declare interface TextSearch {
    value: string;
}

export declare interface ToggleRelationOperation<T, K extends keyof T> {
    operation: "toggle";
    key: string | number;
    attributes?: T[K];
    pivot?: Record<string, string | number>;
}

export declare interface UpdateMutationOperation<TModelAttributes, TRelations> extends BaseMutationData<TModelAttributes, TRelations> {
    operation: "update";
    key: string | number;
}

export { }
