import { Permission, RequestConfig } from "../http/types.js";
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
export interface BaseRelationDefinition {
  operation: RelationDefinitionType;
  __relationDefinition?: true;
}
export interface AttachRelationDefinition extends BaseRelationDefinition {
  operation: "attach";
  key: SimpleKey;
}
export interface DetachRelationDefinition extends BaseRelationDefinition {
  operation: "detach";
  key: SimpleKey;
}
export interface CreateRelationOperation<T> extends BaseRelationDefinition {
  operation: "create";
  attributes: T;
}
export interface UpdateRelationOperation<T> extends BaseRelationDefinition {
  operation: "update";
  key: SimpleKey;
  attributes: T;
}
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
export type ValidCreateNestedRelation<T> =
  | (CreateRelationOperation<T> & {
      relations?: Record<string, ValidCreateNestedRelation<T>>;
    })
  | AttachRelationDefinition;
export type ValidUpdateNestedRelation<T> =
  | (CreateRelationOperation<T> & {
      relations?: Record<string, ValidCreateNestedRelation<T>>;
    })
  | (UpdateRelationOperation<T> & {
      relations?: Record<string, ValidUpdateNestedRelation<T>>;
    })
  | AttachRelationDefinition
  | DetachRelationDefinition
  | SyncRelationDefinition<T>
  | ToggleRelationDefinition<T>;
export type RelationDefinition<
  T = unknown,
  TInCreateContext extends boolean = false,
> = TInCreateContext extends true
  ? ValidCreateNestedRelation<T>
  : ValidUpdateNestedRelation<T>;
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
export type CreateRelationResult<
  T extends Attributes,
  TRelationKey extends keyof T = never,
> = T &
  CreateRelationOperation<T> & {
    relations?: Record<TRelationKey, ValidCreateNestedRelation<unknown>>;
  };
export type UpdateRelationResult<
  T extends Attributes,
  TRelationKey extends keyof T = never,
> = T &
  UpdateRelationOperation<T> & {
    operation: "update";
    relations?: Record<TRelationKey, ValidUpdateNestedRelation<unknown>>;
  };
export type ExtractedAttributes = {
  normalAttributes: Attributes;
  nestedRelations: Attributes;
};
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
export type IsRelationOperation<T> = T extends {
  operation: string;
}
  ? true
  : false;
export type IsValidCreateOperation<T> = T extends {
  operation: "update" | "detach";
}
  ? false
  : true;
export type ValidCreateRelationOnly<T> = T extends {
  operation: "update" | "detach";
}
  ? never
  : T;
export type ValidUpdateRelationOnly<T> = T extends {
  operation: string;
}
  ? T
  : T;
export type CreateEntityAttributes<T, TRelationKeys extends keyof T = never> = {
  [K in keyof T]: K extends TRelationKeys
    ? IsRelationOperation<T[K]> extends true
      ? ValidCreateRelationOnly<T[K]>
      : T[K]
    : T[K];
};
export type UpdateEntityAttributes<T, TRelationKeys extends keyof T = never> = {
  [K in keyof T]: K extends TRelationKeys
    ? IsRelationOperation<T[K]> extends true
      ? ValidUpdateRelationOnly<T[K]>
      : T[K]
    : T[K];
};
export interface BuilderOnly<TModel, TRelations = Record<string, unknown>> {
  build: () => MutationRequest<TModel, TRelations>;
  mutate: (options?: Partial<RequestConfig>) => Promise<MutationResponse>;
}
export type CreateOperationOnly = {
  operation: "create";
};
export type UpdateOperationOnly = {
  operation: "update";
};
export type AttachOperationOnly = {
  operation: "attach";
};
export type DetachOperationOnly = {
  operation: "detach";
};
export type ExcludeUpdateOperations<T> = T extends
  | UpdateOperationOnly
  | DetachOperationOnly
  ? never
  : T;
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
export interface IRelation {
  add: <T extends Attributes, TRelationKey extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKey>,
  ) => CreateRelationResult<T, TRelationKey>;
  edit: <T extends Attributes, TRelationKey extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKey>,
  ) => UpdateRelationResult<T, TRelationKey>;
  attach: (key: SimpleKey) => AttachRelationDefinition;
  detach: (key: SimpleKey) => DetachRelationDefinition;
  sync: <T>(params: SyncParams<T>) => SyncRelationDefinition<T>;
  toggle: <T>(params: ToggleParams<T>) => ToggleRelationDefinition<T>;
}
export interface IModel<TModel> {
  create: <
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    attributes: CreateEntityAttributes<T, TRelationKeys>,
  ) => BuilderOnly<TModel>;
  update: <
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    key: SimpleKey,
    attributes: UpdateEntityAttributes<T, TRelationKeys>,
  ) => BuilderOnly<TModel>;
  build: () => MutationRequest<TModel, Record<string, unknown>>;
  setMutationFunction: (cb: MutationFunction<TModel>) => void;
}
export interface IMutation<T> {
  mutate: (
    mutateRequest: BuilderOnly<T>,
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
