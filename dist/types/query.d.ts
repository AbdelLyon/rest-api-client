import { z } from 'zod';

export declare interface AggregationCriteria {
    relation: string;
    type: AggregationFunction;
    field?: string;
    filters?: Array<Filter>;
}

export declare type AggregationFunction = "min" | "max" | "avg" | "sum" | "count" | "exists";

export declare type ComparisonOperator = "=" | ">" | "<" | "in";

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

declare class HttpClient implements IHttpClient {
    private static instances;
    private static defaultInstanceName;
    private static requestInterceptors;
    private static responseSuccessInterceptors;
    private static responseErrorInterceptors;
    private baseURL;
    private defaultTimeout;
    private defaultHeaders;
    private withCredentials;
    private maxRetries;
    private constructor();
    static init(config: {
        httpConfig: HttpConfig;
        instanceName: string;
    }): HttpClient;
    static getInstance(instanceName?: string): HttpClient;
    static setDefaultInstance(instanceName: string): void;
    static getAvailableInstances(): string[];
    static resetInstance(instanceName?: string): void;
    private configure;
    private getFullBaseUrl;
    private setupDefaultInterceptors;
    private logError;
    private applyRequestInterceptors;
    private applyResponseSuccessInterceptors;
    private applyResponseErrorInterceptors;
    private isRetryableError;
    private fetchWithRetry;
    request<TResponse = any>(config: Partial<RequestConfig> & {
        url: string;
    }, options?: Partial<RequestConfig>): Promise<TResponse>;
}

declare interface HttpConfig extends HttpConfigOptions {
    interceptors?: {
        request?: RequestInterceptor[];
        response?: {
            success?: ResponseSuccessInterceptor[];
            error?: ResponseErrorInterceptor[];
        };
    };
}

declare interface HttpConfigOptions {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    withCredentials?: boolean;
    maxRetries?: number;
    apiPrefix?: string;
    apiVersion?: string | number;
}

declare interface IHttpClient {
    request: <TResponse>(config: RequestConfig, options?: Partial<RequestConfig>) => Promise<TResponse>;
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
    search: (searchRequest: SearchRequest, options?: Partial<RequestConfig>) => Promise<Array<T>>;
    searchPaginate: (searchRequest: SearchRequest, options?: Partial<RequestConfig>) => Promise<SearchResponse<T>>;
    getdetails: (options?: Partial<RequestConfig>) => Promise<DetailsResponse>;
}

export declare type LogicalOperator = "and" | "or";

export declare interface NestedFilterCriteria {
    nested: Array<FilterCriteria>;
}

export declare interface PaginatedSearchRequest extends SearchRequest {
    page?: number;
    limit?: number;
}

export declare abstract class Query<T> implements IQuery<T> {
    protected http: HttpClient;
    protected pathname: string;
    protected schema: z.ZodType<T>;
    constructor(pathname: string, schema: z.ZodType<T>);
    private validateData;
    private searchRequest;
    search(search: SearchRequest, options?: Partial<RequestConfig>): Promise<Array<T>>;
    searchPaginate(search: PaginatedSearchRequest, options?: Partial<RequestConfig>): Promise<SearchResponse<T>>;
    getdetails(options?: Partial<RequestConfig>): Promise<DetailsResponse>;
}

export declare interface RelationInclude {
    relation: string;
    filters?: Array<Filter>;
    sorts?: Array<SortCriteria>;
    selects?: Array<FieldSelection>;
    scopes?: Array<ScopeDefinition>;
    limit?: number;
}

declare interface RequestConfig extends RequestInit {
    url: string;
    params?: Record<string, string>;
    data?: any;
    timeout?: number;
    baseURL?: string;
    headers?: Record<string, string>;
}

declare type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;

declare type ResponseErrorInterceptor = (error: any) => Promise<any>;

declare type ResponseSuccessInterceptor = (response: Response) => Promise<Response> | Response;

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

export declare interface TextSearch {
    value: string;
}

export { }
