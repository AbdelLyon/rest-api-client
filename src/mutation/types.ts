import type { Permission, RequestConfig } from "@/http/types";

// ==================== 1. TYPES FONDAMENTAUX ====================

export type SimpleKey = string | number;
export type CompositeKey = SimpleKey | Array<SimpleKey>;
export type Attributes = Record<string, unknown>;
export type PivotData = Record<string, string | number>;
export type RelationDefinitionType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

// ==================== 2. DÉFINITIONS DES OPÉRATIONS DE BASE ====================

export interface BaseRelationDefinition {
  operation: RelationDefinitionType;
  __relationDefinition?: true;
}

// Opérations simples
export interface AttachRelationDefinition extends BaseRelationDefinition {
  operation: "attach";
  key: SimpleKey;
}

export interface DetachRelationDefinition extends BaseRelationDefinition {
  operation: "detach";
  key: SimpleKey;
}

// Opérations avec données
export interface CreateRelationOperation<T> extends BaseRelationDefinition {
  operation: "create";
  attributes: T;
}

export interface UpdateRelationOperation<T> extends BaseRelationDefinition {
  operation: "update";
  key: SimpleKey;
  attributes: T;
}

// Opérations de gestion collective
export interface SyncRelationDefinition<T> extends BaseRelationDefinition {
  operation: "sync";
  without_detaching?: boolean;
  key: CompositeKey;
  attributes?: T;
  pivot?: PivotData;
}

export interface ToggleRelationDefinition<T> extends BaseRelationDefinition {
  operation: "toggle";
  key: CompositeKey;
  attributes?: T;
  pivot?: PivotData;
}

// ==================== 3. TYPES DE RELATIONS IMBRIQUÉES ====================

// Définitions récursives pour les relations imbriquées
export type ValidCreateNestedRelation<T> =
  | (CreateRelationOperation<T> & {
      relations?: Record<string, ValidCreateNestedRelation<T>>;
    })
  | AttachRelationDefinition;

export type ValidUpdateNestedRelation<T> =
  | (CreateRelationOperation<T> & {
      relations?: Record<string, ValidUpdateNestedRelation<T>>;
    })
  | (UpdateRelationOperation<T> & {
      relations?: Record<string, ValidUpdateNestedRelation<T>>;
    })
  | AttachRelationDefinition
  | DetachRelationDefinition
  | SyncRelationDefinition<T>
  | ToggleRelationDefinition<T>;

// ==================== 4. OPÉRATIONS VALIDES PAR CONTEXTE ====================

// Opérations valides dans un contexte de création d'entité
export type CreateValidRelationOperation =
  | ValidCreateNestedRelation<Attributes>
  | AttachRelationDefinition;

// Opérations valides dans un contexte de mise à jour d'entité
export type UpdateValidRelationOperation =
  | ValidUpdateNestedRelation<Attributes>
  | AttachRelationDefinition
  | DetachRelationDefinition
  | SyncRelationDefinition<Attributes>
  | ToggleRelationDefinition<Attributes>;

// Type générique pour relation avec contexte
export type RelationDefinition<
  T = unknown,
  TInCreateContext extends boolean = false,
> = TInCreateContext extends true
  ? ValidCreateNestedRelation<T>
  : ValidUpdateNestedRelation<T>;

// ==================== 5. INTERFACES CONTEXTUELLES DE RELATION ====================

// Interface pour contexte de création - opérations limitées
export interface ICreationRelation {
  add: <T extends Attributes, TRelationKeys extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKeys>,
  ) => CreateValidRelationOperation;

  attach: (key: SimpleKey) => AttachRelationDefinition;
}

// Interface pour contexte de mise à jour - toutes les opérations
export interface IUpdateRelation {
  add: <T extends Attributes, TRelationKeys extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKeys>,
  ) => CreateValidRelationOperation;

  edit: <T extends Attributes, TRelationKeys extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKeys>,
  ) => UpdateValidRelationOperation;

  attach: (key: SimpleKey) => AttachRelationDefinition;

  detach: (key: SimpleKey) => DetachRelationDefinition;

  sync: <T>(params: SyncParams<T>) => SyncRelationDefinition<T>;

  toggle: <T>(params: ToggleParams<T>) => ToggleRelationDefinition<T>;
}

// Interface complète qui hérite des deux contextuelles
export interface IRelation extends IUpdateRelation, ICreationRelation {
  getCreationContext(): ICreationRelation;
  getUpdateContext(): IUpdateRelation;
}

// ==================== 6. PARAMÈTRES DES MÉTHODES DE RELATION ====================

export type CreateRelationParams<
  T extends Attributes,
  TRelationKey extends keyof T = never,
> = {
  attributes: T;
  relations?: Record<TRelationKey, ValidCreateNestedRelation<unknown>>;
};

export type UpdateRelationParams<
  T extends Attributes,
  TRelationKey extends keyof T = never,
> = {
  key: SimpleKey;
  attributes: T;
  relations?: Record<TRelationKey, ValidUpdateNestedRelation<unknown>>;
};

export type SyncParams<T> = {
  key: CompositeKey;
  attributes?: T;
  pivot?: PivotData;
  withoutDetaching?: boolean;
};

export type ToggleParams<T> = {
  key: CompositeKey;
  attributes?: T;
  pivot?: PivotData;
};

// ==================== 7. TYPES DE BUILDERS ET MUTATION ====================

// Types de builders contextuels
export interface BuilderWithCreationContext<
  TModel,
  TRelations = Record<string, unknown>,
> {
  build: () => MutationRequest<TModel, TRelations>;
  mutate: (options?: Partial<RequestConfig>) => Promise<MutationResponse>;
  relation: ICreationRelation;
}

export interface BuilderWithUpdateContext<
  TModel,
  TRelations = Record<string, unknown>,
> {
  build: () => MutationRequest<TModel, TRelations>;
  mutate: (options?: Partial<RequestConfig>) => Promise<MutationResponse>;
  relation: IUpdateRelation;
}

// Types de mutation
export type TypedMutationOperation<
  TModel,
  TRelations = Record<string, unknown>,
> = {
  operation: "create" | "update";
  key?: SimpleKey;
  attributes: ExtractModelAttributes<TModel>;
  relations: TRelations;
};

export type MutationRequest<TModel, TRelations = Record<string, unknown>> = {
  mutate: Array<TypedMutationOperation<TModel, TRelations>>;
};

export interface MutationFunction<T> {
  (
    data: MutationRequest<T, Record<string, unknown>>,
    options?: Partial<RequestConfig>,
  ): Promise<MutationResponse>;
}

export interface MutationResponse {
  created: Array<SimpleKey>;
  updated: Array<SimpleKey>;
}

// ==================== 8. TYPES UTILITAIRES ====================

export type ExtractedAttributes = {
  normalAttributes: Attributes;
  nestedRelations: Attributes;
};

export type ExtractModelAttributes<T> = Omit<T, "relations">;

// Vérifie si un type est une opération de relation
export type IsRelationOperation<T> = T extends {
  operation: RelationDefinitionType;
}
  ? true
  : false;

// Vérifie si une opération est valide dans un contexte de création
export type IsCreateOperationValid<T> = T extends {
  operation: "update" | "detach";
}
  ? false
  : true;

// Filtre pour ne garder que les opérations valides en création
export type FilterValidCreateOperation<T> = T extends {
  operation: "update" | "detach";
}
  ? never
  : T;

// Filtre pour ne garder que les opérations valides en mise à jour
export type FilterValidUpdateOperation<T> = T extends {
  operation: RelationDefinitionType;
}
  ? T
  : never;

// ==================== 9. MAPS DE RELATIONS ====================

// Maps pour filtrage des opérations
export type CreateRelationsMap<TRelations extends Record<string, unknown>> = {
  [K in keyof TRelations]: FilterValidCreateOperation<TRelations[K]>;
};

export type UpdateRelationsMap<TRelations extends Record<string, unknown>> = {
  [K in keyof TRelations]: FilterValidUpdateOperation<TRelations[K]>;
};

// Maps strictes pour les interfaces
export type StrictCreateRelationsMap<
  TRelations extends Record<string, unknown>,
> = {
  [K in keyof TRelations]: CreateValidRelationOperation;
};

export type StrictUpdateRelationsMap<
  TRelations extends Record<string, unknown>,
> = {
  [K in keyof TRelations]: UpdateValidRelationOperation;
};

// ==================== 10. TYPES D'OPÉRATIONS SIMPLES ====================

// Types pour les opérations atomiques
export type CreateOperationOnly = { operation: "create" };
export type UpdateOperationOnly = { operation: "update" };
export type AttachOperationOnly = { operation: "attach" };
export type DetachOperationOnly = { operation: "detach" };
export type SyncOperationOnly = { operation: "sync" };
export type ToggleOperationOnly = { operation: "toggle" };

// Filtre pour exclure certaines opérations
export type ExcludeUpdateOperations<T> = T extends
  | UpdateOperationOnly
  | DetachOperationOnly
  ? never
  : T;

// ==================== 11. ACTIONS ET SUPPRESSIONS ====================

export interface ActionFieldDefinition {
  name: string;
  value: string | number | boolean;
}

export interface ActionFilterCriteria {
  field: string;
  value: boolean | string | number;
}

export interface ActionPayload {
  fields: Array<ActionFieldDefinition>;
  search?: {
    filters?: Array<ActionFilterCriteria>;
  };
}

export interface ActionRequest {
  action: string;
  payload: ActionPayload;
}

export interface ActionResponse {
  data: {
    impacted: number;
  };
}

export interface DeleteRequest {
  resources: Array<SimpleKey>;
}

export interface DeleteResponse<T> {
  data: Array<T>;
  meta?: {
    gates?: Partial<Permission>;
  };
}

// ==================== 12. INTERFACES PRINCIPALES ====================

// Interface du modèle avec contextes
export interface IModel<TModel> {
  create: <
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(params: {
    attributes: T;
    relations?: StrictCreateRelationsMap<
      Record<Extract<TRelationKeys, string>, unknown>
    >;
  }) => BuilderWithCreationContext<TModel>;

  update<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    key: SimpleKey,
    params: {
      attributes?: T;
      relations?: Record<Extract<TRelationKeys, string>, unknown>;
    },
  ): BuilderWithUpdateContext<TModel>;

  setMutationFunction: (cb: MutationFunction<TModel>) => void;
}

// Interface de mutation
export interface IMutation<T> {
  mutate: (
    mutateRequest: BuilderWithCreationContext<T> | BuilderWithUpdateContext<T>,
    options?: Partial<RequestConfig>,
  ) => Promise<MutationResponse>;

  action: (
    actionRequest: ActionRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<ActionResponse>;

  delete: (
    request: DeleteRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<DeleteResponse<T>>;

  forceDelete: (
    request: DeleteRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<DeleteResponse<T>>;

  restore: (
    request: DeleteRequest,
    options?: Partial<RequestConfig>,
  ) => Promise<DeleteResponse<T>>;
}
