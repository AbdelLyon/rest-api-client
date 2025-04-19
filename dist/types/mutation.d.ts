import { z } from 'zod';

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

export declare type AttachOperationOnly = {
    operation: "attach";
};

export declare interface AttachRelationDefinition extends BaseRelationDefinition {
    operation: "attach";
    key: string | number;
}

export declare interface BaseRelationDefinition {
    operation: RelationDefinitionType;
    __relationDefinition?: true;
}

export declare interface BuildOnly<TModel, TRelations = {}> {
    build(): MutationRequest<TModel, TRelations>;
    mutate(options?: Partial<RequestConfig>): Promise<MutationResponse>;
}

export declare type CreateEntityAttributes<T, RelationKeys extends keyof T = never> = {
    [K in keyof T]: K extends RelationKeys ? IsRelationOperation<T[K]> extends true ? ValidCreateRelationOnly<T[K]> : T[K] : T[K];
};

export declare type CreateOperationOnly = {
    operation: "create";
};

export declare interface CreateRelationOperation<T> extends BaseRelationDefinition {
    operation: "create";
    attributes: T;
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

export declare type DetachOperationOnly = {
    operation: "detach";
};

export declare interface DetachRelationDefinition extends BaseRelationDefinition {
    operation: "detach";
    key: string | number;
}

export declare type ExcludeUpdateOperations<T> = T extends UpdateOperationOnly | DetachOperationOnly ? never : T;

export declare type ExtractModelAttributes<T> = Omit<T, 'relations'>;

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

declare interface IEntityBuilder<TModel> {
    createEntity<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(attributes: {
        [K in keyof T]: K extends RelationKeys ? ValidCreateRelationOnly<T[K]> : T[K];
    }): BuildOnly<TModel, Pick<T, Extract<RelationKeys, string>>>;
    updateEntity<T extends Record<string, unknown>>(key: string | number, attributes: T): IEntityBuilder<TModel>;
    build(): MutationRequest<TModel>;
    setMutationFunction(cb: MutationFunction): void;
}

declare interface IHttpClient {
    request: <TResponse>(config: RequestConfig, options?: Partial<RequestConfig>) => Promise<TResponse>;
}

export declare interface IMutation<T> {
    mutate(mutateRequest: BuildOnly<T>, options?: Partial<RequestConfig>): Promise<MutationResponse>;
    executeAction(actionRequest: ActionRequest, options?: Partial<RequestConfig>): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
}

declare interface IRelationBuilder {
    createRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(attributes: T, relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>): T & CreateRelationOperation<T> & {
        relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>;
    };
    updateRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(key: string | number, attributes: T, relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>): T & UpdateRelationOperation<T> & {
        relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>;
    };
    attach(key: string | number): AttachRelationDefinition;
    detach(key: string | number): DetachRelationDefinition;
    sync<T>(key: string | number | Array<string | number>, attributes?: T, pivot?: Record<string, string | number>, withoutDetaching?: boolean): SyncRelationDefinition<T>;
    toggle<T>(key: string | number | Array<string | number>, attributes?: T, pivot?: Record<string, string | number>): ToggleRelationDefinition<T>;
}

export declare type IsRelationOperation<T> = T extends {
    operation: string;
} ? true : false;

export declare type IsValidCreateOperation<T> = T extends {
    operation: "update" | "detach";
} ? false : true;

export declare abstract class Mutation<T> implements IMutation<T> {
    protected http: HttpClient;
    protected pathname: string;
    protected schema: z.ZodType<T>;
    private readonly relation;
    constructor(pathname: string, schema: z.ZodType<T>);
    entityBuilder(): IEntityBuilder<T>;
    relationBuilder(): IRelationBuilder;
    private validateData;
    mutate(mutateRequest: BuildOnly<T> | {
        mutate: Array<any>;
    }, options?: Partial<RequestConfig>): Promise<MutationResponse>;
    executeAction(actionRequest: ActionRequest, options?: Partial<RequestConfig>): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
}

export declare interface MutationFunction {
    (data: any, options?: Partial<RequestConfig>): Promise<MutationResponse>;
}

export declare type MutationRequest<TModel, TRelations = {}> = {
    mutate: Array<TypedMutationOperation<TModel, TRelations>>;
};

export declare interface MutationResponse {
    created: Array<string | number>;
    updated: Array<string | number>;
}

declare interface Permission {
    authorized_to_view: boolean;
    authorized_to_create: boolean;
    authorized_to_update: boolean;
    authorized_to_delete: boolean;
    authorized_to_restore: boolean;
    authorized_to_force_delete: boolean;
}

export declare type RelationDefinition<T = unknown, InCreateContext extends boolean = false> = InCreateContext extends true ? ValidCreateNestedRelation<T> : ValidUpdateNestedRelation<T>;

export declare type RelationDefinitionType = "create" | "update" | "attach" | "detach" | "sync" | "toggle";

export declare type RelationResult<T, Op extends string> = T & {
    operation: Op;
};

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

export declare interface SyncRelationDefinition<T> extends BaseRelationDefinition {
    operation: "sync";
    without_detaching?: boolean;
    key: string | number | Array<string | number>;
    attributes?: T;
    pivot?: Record<string, string | number>;
}

export declare interface ToggleRelationDefinition<T> extends BaseRelationDefinition {
    operation: "toggle";
    key: string | number | Array<string | number>;
    attributes?: T;
    pivot?: Record<string, string | number>;
}

export declare type TypedMutationOperation<TModel, TRelations = {}> = {
    operation: "create" | "update";
    key?: string | number;
    attributes: ExtractModelAttributes<TModel>;
    relations: TRelations;
};

export declare type UpdateOperationOnly = {
    operation: "update";
};

export declare interface UpdateRelationOperation<T> extends BaseRelationDefinition {
    operation: "update";
    key: string | number;
    attributes: T;
}

export declare type ValidCreateNestedRelation<T> = (CreateRelationOperation<T> & {
    relations?: Record<string, ValidCreateNestedRelation<any>>;
}) | AttachRelationDefinition;

export declare type ValidCreateRelationOnly<T> = T extends {
    operation: "update" | "detach";
} ? never : T;

export declare type ValidUpdateNestedRelation<T> = (CreateRelationOperation<T> & {
    relations?: Record<string, ValidCreateNestedRelation<any>>;
}) | (UpdateRelationOperation<T> & {
    relations?: Record<string, ValidUpdateNestedRelation<any>>;
}) | AttachRelationDefinition | DetachRelationDefinition | SyncRelationDefinition<T> | ToggleRelationDefinition<T>;

export { }
