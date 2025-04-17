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

export declare interface AggregationCriteria {
    relation: string;
    type: AggregationFunction;
    field?: string;
    filters?: Array<Filter>;
}

export declare type AggregationFunction = "min" | "max" | "avg" | "sum" | "count" | "exists";

export declare interface ApiErrorSource {
    [key: string]: unknown;
    status?: number;
    statusText?: string;
    data?: unknown;
    response?: Response;
}

export declare interface AttachRelationDefinition extends BaseRelationDefinition {
    operation: "attach";
    key: string | number;
}

/**
 * Interface pour une relation de type "attach"
 */
declare interface AttachRelationDefinition_2 extends BaseRelationDefinition_2 {
    operation: "attach";
    key: string | number;
}

export declare abstract class Auth<UserType extends object = {}, CredentialsType extends object = {}, RegisterDataType extends object = {}, TokenType extends object = {}> implements IAuth<UserType, CredentialsType, RegisterDataType, TokenType> {
    protected http: HttpClient;
    protected pathname: string;
    protected userSchema: z.ZodType<UserType>;
    protected credentialsSchema?: z.ZodType<CredentialsType>;
    protected registerDataSchema?: z.ZodType<RegisterDataType>;
    protected tokenSchema?: z.ZodType<TokenType>;
    constructor(pathname: string, schemas: {
        user: z.ZodType<UserType>;
        credentials?: z.ZodType<CredentialsType>;
        registerData?: z.ZodType<RegisterDataType>;
        tokens?: z.ZodType<TokenType>;
    });
    /**
     * Inscription
     */
    register(userData: RegisterDataType, options?: Partial<RequestConfig>): Promise<UserType>;
    /**
     * Connexion
     */
    login(credentials: CredentialsType, options?: Partial<RequestConfig>): Promise<{
        user: UserType;
        tokens: TokenType;
    }>;
    /**
     * Déconnexion
     */
    logout(options?: Partial<RequestConfig>): Promise<void>;
    /**
     * Rafraîchissement du token
     */
    refreshToken(refreshToken: string, options?: Partial<RequestConfig>): Promise<TokenType>;
    /**
     * Récupération de l'utilisateur courant
     */
    getCurrentUser(options?: Partial<RequestConfig>): Promise<UserType>;
}

declare interface BaseRelationDefinition {
    operation: RelationDefinitionType;
}

/**
 * Interface de base pour une définition de relation
 */
declare interface BaseRelationDefinition_2 {
    operation: RelationDefinitionType_2;
}

/**
 * Builder intelligent pour les requêtes de mutation et les opérations de relation
 */
declare class Builder<TModel> {
    private static instance;
    private request;
    /**
     * Récupère l'instance unique du Builder (pattern Singleton)
     */
    static getInstance<T>(): Builder<T>;
    /**
     * Crée une nouvelle instance du Builder
     */
    static createBuilder<T>(): Builder<T>;
    /**
     * Ajoute une opération de création à la requête
     * @param attributes Attributs de l'objet à créer
     * @param relations Relations à associer à l'objet créé
     */
    create(attributes: ExtractModelAttributes<TModel>, relations?: Record<string, any>): this;
    /**
     * Ajoute une opération de mise à jour à la requête
     * @param key ID de l'objet à mettre à jour
     * @param attributes Attributs à mettre à jour
     * @param relations Relations à mettre à jour
     */
    update(key: string | number, attributes: Partial<ExtractModelAttributes<TModel>>, relations?: Record<string, any>): this;
    /**
     * Construit et retourne l'objet de requête final
     */
    build(): MutationRequest_2<ExtractModelAttributes<TModel>>;
    /**
     * Crée une définition de relation de type "create"
     */
    static createRelation<T>(attributes: T, nestedRelations?: Record<string, any>): CreateRelationDefinitionBase_2<T> & {
        relations?: typeof nestedRelations;
    };
    /**
     * Crée une définition de relation de type "update"
     */
    static updateRelation<T>(key: string | number, attributes: T, nestedRelations?: Record<string, any>): UpdateRelationDefinitionBase_2<T> & {
        relations?: typeof nestedRelations;
    };
    /**
     * Crée une définition de relation de type "attach"
     */
    static attach(key: string | number): AttachRelationDefinition_2;
    /**
     * Crée une définition de relation de type "detach"
     */
    static detach(key: string | number): DetachRelationDefinition_2;
    /**
     * Crée une définition de relation de type "sync"
     */
    static sync<T>(key: string | number | Array<string | number>, attributes?: T, pivot?: Record<string, string | number>, withoutDetaching?: boolean): SyncRelationDefinition_2<T>;
    /**
     * Crée une définition de relation de type "toggle"
     */
    static toggle<T>(key: string | number | Array<string | number>, attributes?: T, pivot?: Record<string, string | number>): ToggleRelationDefinition_2<T>;
}

export declare type ComparisonOperator = "=" | ">" | "<" | "in";

export declare interface CreateMutationOperation<TAttributes, TRelations> extends MutationData<TAttributes, TRelations, true> {
    operation: "create";
}

declare interface CreateRelationDefinitionBase<T> extends BaseRelationDefinition {
    operation: "create";
    attributes: T;
}

/**
 * Interface pour une relation de type "create"
 */
declare interface CreateRelationDefinitionBase_2<T> extends BaseRelationDefinition_2 {
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

export declare interface DetachRelationDefinition extends BaseRelationDefinition {
    operation: "detach";
    key: string | number;
}

/**
 * Interface pour une relation de type "detach"
 */
declare interface DetachRelationDefinition_2 extends BaseRelationDefinition_2 {
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

/**
 * Extrait les attributs d'un modèle (tout sauf les relations)
 */
declare type ExtractModelAttributes<T> = Omit<T, 'relations'>;

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
    /**
     * Initialise une nouvelle instance HTTP avec intercepteurs
     */
    static init(config: {
        httpConfig: HttpConfig;
        instanceName: string;
    }): HttpClient;
    /**
     * Récupère une instance existante
     */
    static getInstance(instanceName?: string): HttpClient;
    /**
     * Définit l'instance par défaut
     */
    static setDefaultInstance(instanceName: string): void;
    /**
     * Récupère la liste des instances disponibles
     */
    static getAvailableInstances(): string[];
    /**
     * Réinitialise une instance ou toutes les instances
     */
    static resetInstance(instanceName?: string): void;
    /**
     * Configure l'instance HTTP
     */
    private configure;
    /**
     * Construit l'URL de base complète
     */
    private getFullBaseUrl;
    /**
     * Configure les intercepteurs par défaut
     */
    private setupDefaultInterceptors;
    /**
     * Journalise les erreurs de requête
     */
    private logError;
    /**
     * Applique les intercepteurs de requête
     */
    private applyRequestInterceptors;
    /**
     * Applique les intercepteurs de réponse réussie
     */
    private applyResponseSuccessInterceptors;
    /**
     * Applique les intercepteurs d'erreur de réponse
     */
    private applyResponseErrorInterceptors;
    /**
     * Détermine si une erreur est susceptible d'être réessayée
     */
    private isRetryableError;
    /**
     * Effectue une requête avec gestion des tentatives
     */
    private fetchWithRetry;
    /**
     * Méthode principale pour effectuer une requête
     */
    request<TResponse = any>(config: Partial<RequestConfig> & {
        url: string;
    }, options?: Partial<RequestConfig>): Promise<TResponse>;
}

export declare interface HttpConfig extends HttpConfigOptions {
    interceptors?: {
        request?: RequestInterceptor[];
        response?: {
            success?: ResponseSuccessInterceptor[];
            error?: ResponseErrorInterceptor[];
        };
    };
}

export declare interface HttpConfigOptions {
    baseURL: string;
    timeout?: number;
    headers?: Record<string, string>;
    withCredentials?: boolean;
    maxRetries?: number;
    apiPrefix?: string;
    apiVersion?: string | number;
}

export declare interface IAuth<UserType extends object, CredentialsType extends object, RegisterDataType extends object, TokenType extends object> {
    register(userData: RegisterDataType, options?: Partial<RequestConfig>): Promise<UserType>;
    login(credentials: CredentialsType, options?: Partial<RequestConfig>): Promise<{
        user: UserType;
        tokens: TokenType;
    }>;
    logout(options?: Partial<RequestConfig>): Promise<void>;
    refreshToken(refreshToken: string, options?: Partial<RequestConfig>): Promise<TokenType>;
    getCurrentUser(options?: Partial<RequestConfig>): Promise<UserType>;
}

export declare interface IHttpClient {
    request: <TResponse>(config: RequestConfig, options?: Partial<RequestConfig>) => Promise<TResponse>;
}

export declare interface IMutation<T> {
    mutate<TAttributes, TRelations>(mutateRequest: MutationRequest<TAttributes, TRelations>, options?: Partial<RequestConfig>): Promise<MutationResponse>;
    executeAction(actionRequest: ActionRequest, options?: Partial<RequestConfig>): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
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

export declare abstract class Mutation<T> implements IMutation<T> {
    protected http: HttpClient;
    protected builder: Builder<T>;
    protected pathname: string;
    protected schema: z.ZodType<T>;
    constructor(pathname: string, schema: z.ZodType<T>);
    private validateData;
    mutate<TAttributes, TRelations>(mutateRequest: MutationRequest<TAttributes, TRelations>, options?: Partial<RequestConfig>): Promise<MutationResponse>;
    executeAction(actionRequest: ActionRequest, options?: Partial<RequestConfig>): Promise<ActionResponse>;
    delete(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
    forceDelete(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
    restore(request: DeleteRequest, options?: Partial<RequestConfig>): Promise<DeleteResponse<T>>;
}

declare interface MutationData<TAttributes, TRelations, InCreateContext extends boolean> {
    attributes: TAttributes;
    relations?: {
        [K in keyof TRelations]: TRelations[K] extends RelationDefinition<infer T, any> ? RelationDefinition<T, InCreateContext> : never;
    };
}

export declare type MutationOperation<TAttributes, TRelations> = CreateMutationOperation<TAttributes, TRelations> | UpdateMutationOperation<TAttributes, TRelations>;

/**
 * Interface générique pour une opération de mutation
 */
declare interface MutationOperation_2<TAttributes> {
    operation: "create" | "update";
    attributes: TAttributes;
    relations?: Record<string, any>;
    key?: string | number;
}

export declare interface MutationRequest<TAttributes, TRelations> {
    mutate: Array<MutationOperation<TAttributes, TRelations>>;
}

/**
 * Interface pour une requête de mutation
 */
declare interface MutationRequest_2<TAttributes> {
    mutate: Array<MutationOperation_2<TAttributes>>;
}

export declare interface MutationResponse {
    created: Array<string | number>;
    updated: Array<string | number>;
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
    protected schema: z.ZodType<T>;
    constructor(pathname: string, schema: z.ZodType<T>);
    private validateData;
    private searchRequest;
    search(search: SearchRequest, options?: Partial<RequestConfig>): Promise<Array<T>>;
    searchPaginate(search: PaginatedSearchRequest, options?: Partial<RequestConfig>): Promise<SearchResponse<T>>;
    getdetails(options?: Partial<RequestConfig>): Promise<DetailsResponse>;
}

export declare type RelationDefinition<T, InCreateContext extends boolean = false> = InCreateContext extends true ? (CreateRelationDefinitionBase<T> & {
    relations?: {
        [key: string]: RelationDefinition<any, true>;
    };
}) | AttachRelationDefinition : (CreateRelationDefinitionBase<T> & {
    relations?: {
        [key: string]: RelationDefinition<any, false>;
    };
}) | (UpdateRelationDefinitionBase<T> & {
    relations?: {
        [key: string]: RelationDefinition<any, false>;
    };
}) | AttachRelationDefinition | DetachRelationDefinition | SyncRelationDefinition<T> | ToggleRelationDefinition<T>;

export declare type RelationDefinitionType = "create" | "update" | "attach" | "detach" | "sync" | "toggle";

/**
 * Types d'opérations de relation
 */
declare type RelationDefinitionType_2 = "create" | "update" | "attach" | "detach" | "sync" | "toggle";

export declare interface RelationInclude {
    relation: string;
    filters?: Array<Filter>;
    sorts?: Array<SortCriteria>;
    selects?: Array<FieldSelection>;
    scopes?: Array<ScopeDefinition>;
    limit?: number;
}

export declare interface RequestConfig extends RequestInit {
    url: string;
    params?: Record<string, string>;
    data?: any;
    timeout?: number;
    baseURL?: string;
    headers?: Record<string, string>;
}

export declare type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;

export declare type ResponseErrorInterceptor = (error: any) => Promise<any>;

export declare type ResponseSuccessInterceptor = (response: Response) => Promise<Response> | Response;

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

export declare interface SyncRelationDefinition<T> extends BaseRelationDefinition {
    operation: "sync";
    without_detaching?: boolean;
    key: string | number | Array<string | number>;
    attributes?: T;
    pivot?: Record<string, string | number>;
}

/**
 * Interface pour une relation de type "sync"
 */
declare interface SyncRelationDefinition_2<T> extends BaseRelationDefinition_2 {
    operation: "sync";
    without_detaching?: boolean;
    key: string | number | Array<string | number>;
    attributes?: T;
    pivot?: Record<string, string | number>;
}

export declare interface TextSearch {
    value: string;
}

export declare interface ToggleRelationDefinition<T> extends BaseRelationDefinition {
    operation: "toggle";
    key: string | number | Array<string | number>;
    attributes?: T;
    pivot?: Record<string, string | number>;
}

/**
 * Interface pour une relation de type "toggle"
 */
declare interface ToggleRelationDefinition_2<T> extends BaseRelationDefinition_2 {
    operation: "toggle";
    key: string | number | Array<string | number>;
    attributes?: T;
    pivot?: Record<string, string | number>;
}

export declare interface UpdateMutationOperation<TAttributes, TRelations> extends MutationData<TAttributes, TRelations, false> {
    operation: "update";
    key: string | number;
}

declare interface UpdateRelationDefinitionBase<T> extends BaseRelationDefinition {
    operation: "update";
    key: string | number;
    attributes: T;
}

/**
 * Interface pour une relation de type "update"
 */
declare interface UpdateRelationDefinitionBase_2<T> extends BaseRelationDefinition_2 {
    operation: "update";
    key: string | number;
    attributes: T;
}

export { }
