import type { Permission, RequestConfig } from "@/http/types";

// ==================== 1. TYPES FONDAMENTAUX ====================

export type SimpleKey = string | number;
export type CompositeKey = SimpleKey | Array<SimpleKey>;
export type Attributes = Record<string, unknown>;
export type PivotData = Record<string, string | number>;

// ==================== 2. DÉFINITIONS DES OPÉRATIONS DE BASE ====================

export interface BaseRelationDefinition {
  operation: string;
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
  relations?: Record<string, CreateValidRelationOperation>;
}

export interface UpdateRelationOperation<T> extends BaseRelationDefinition {
  operation: "update";
  key: SimpleKey;
  attributes: T;
  relations?: Record<string, UpdateValidRelationOperation>;
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

// ==================== 3. OPÉRATIONS VALIDES PAR CONTEXTE ====================

// Opérations valides en contexte de création
export type CreateValidRelationOperation =
  | CreateRelationOperation<Attributes>
  | AttachRelationDefinition;

// Opérations valides en contexte de mise à jour
export type UpdateValidRelationOperation =
  | CreateRelationOperation<Attributes>
  | UpdateRelationOperation<Attributes>
  | AttachRelationDefinition
  | DetachRelationDefinition
  | SyncRelationDefinition<Attributes>
  | ToggleRelationDefinition<Attributes>;

// ==================== 4. PARAMÈTRES DES MÉTHODES DE RELATION ====================

export type CreateRelationParams<
  T extends Attributes,
  TRelationKey extends keyof T = never,
> = {
  attributes: T;
  relations?: Record<TRelationKey, CreateValidRelationOperation>;
};

export type UpdateRelationParams<
  T extends Attributes,
  TRelationKey extends keyof T = never,
> = {
  key: SimpleKey;
  attributes: T;
  relations?: Record<TRelationKey, UpdateValidRelationOperation>;
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

// ==================== 5. INTERFACES DE RELATION CONTEXTUELLES ====================

// Interface pour les opérations en contexte de création
export interface ICreationRelation {
  add: <T extends Attributes, TRelationKey extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKey>,
  ) => CreateRelationOperation<T>;

  attach: (key: SimpleKey) => AttachRelationDefinition;
}

// Interface pour les opérations en contexte de mise à jour
export interface IUpdateRelation {
  add: <T extends Attributes, TRelationKey extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKey>,
  ) => CreateRelationOperation<T>;

  edit: <T extends Attributes, TRelationKey extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKey>,
  ) => UpdateRelationOperation<T>;

  attach: (key: SimpleKey) => AttachRelationDefinition;

  detach: (key: SimpleKey) => DetachRelationDefinition;

  sync: <T>(params: SyncParams<T>) => SyncRelationDefinition<T>;

  toggle: <T>(params: ToggleParams<T>) => ToggleRelationDefinition<T>;
}

// ==================== 6. INTERFACES DE MUTATION ET BUILDER ====================

export type ExtractModelAttributes<T> = Omit<T, "relations">;

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

// Interfaces pour les builders contextuels
export interface BuilderWithCreationContext<TModel> {
  build: () => MutationRequest<TModel, Record<string, unknown>>;
  mutate: (options?: Partial<RequestConfig>) => Promise<MutationResponse>;
  relation: ICreationRelation;
}

export interface BuilderWithUpdateContext<TModel> {
  build: () => MutationRequest<TModel, Record<string, unknown>>;
  mutate: (options?: Partial<RequestConfig>) => Promise<MutationResponse>;
  relation: IUpdateRelation;
}

// Types pour les maps de relations
export type StrictCreateRelationsMap<T extends Record<string, unknown>> = {
  [K in keyof T]: CreateValidRelationOperation;
};

export type StrictUpdateRelationsMap<T extends Record<string, unknown>> = {
  [K in keyof T]: UpdateValidRelationOperation;
};

// ==================== 7. ACTIONS ET SUPPRESSIONS ====================

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

// ==================== 8. INTERFACES PRINCIPALES ====================

export interface IModel<TModel> {
  create<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(params: {
    attributes: T;
    relations?: StrictCreateRelationsMap<
      Record<Extract<TRelationKeys, string>, unknown>
    >;
  }): BuilderWithCreationContext<TModel>;

  update<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    key: SimpleKey,
    params: {
      attributes?: T;
      relations?: StrictUpdateRelationsMap<
        Record<Extract<TRelationKeys, string>, unknown>
      >;
    },
  ): BuilderWithUpdateContext<TModel>;

  setMutationFunction: (cb: MutationFunction<TModel>) => void;
}

export interface IMutation<T> {
  model: IModel<T>;

  mutate: (
    mutateRequest:
      | BuilderWithCreationContext<T>
      | BuilderWithUpdateContext<T>
      | MutationRequest<T, Record<string, unknown>>,
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
