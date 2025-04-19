import type { RequestConfig } from "@/http/types/http";

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
  key: string | number;
}

export interface DetachRelationDefinition extends BaseRelationDefinition {
  operation: "detach";
  key: string | number;
}

export interface CreateRelationOperation<T> extends BaseRelationDefinition {
  operation: "create";
  attributes: T;
}

export interface UpdateRelationOperation<T> extends BaseRelationDefinition {
  operation: "update";
  key: string | number;
  attributes: T;
}

export interface SyncRelationDefinition<T> extends BaseRelationDefinition {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number | Array<string | number>;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

export interface ToggleRelationDefinition<T> extends BaseRelationDefinition {
  operation: "toggle";
  key: string | number | Array<string | number>;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

export type ValidCreateNestedRelation<T> =
  | (CreateRelationOperation<T> & { relations?: Record<string, ValidCreateNestedRelation<any>>; })
  | AttachRelationDefinition;

export type ValidUpdateNestedRelation<T> =
  | (CreateRelationOperation<T> & { relations?: Record<string, ValidCreateNestedRelation<any>>; })
  | (UpdateRelationOperation<T> & { relations?: Record<string, ValidUpdateNestedRelation<any>>; })
  | AttachRelationDefinition
  | DetachRelationDefinition
  | SyncRelationDefinition<T>
  | ToggleRelationDefinition<T>;

export type RelationDefinition<T = unknown, TInCreateContext extends boolean = false> =
  TInCreateContext extends true
  ? ValidCreateNestedRelation<T>
  : ValidUpdateNestedRelation<T>;

export type ExtractModelAttributes<T> = Omit<T, 'relations'>;

export type TypedMutationOperation<TModel, TRelations = {}> = {
  operation: "create" | "update";
  key?: string | number;
  attributes: ExtractModelAttributes<TModel>;
  relations: TRelations;
};

export type MutationRequest<TModel, TRelations = {}> = {
  mutate: Array<TypedMutationOperation<TModel, TRelations>>;
};

export interface MutationFunction {
  (data: any, options?: Partial<RequestConfig>): Promise<MutationResponse>;
}

export interface MutationResponse {
  created: Array<string | number>;
  updated: Array<string | number>;
}

export type IsRelationOperation<T> = T extends { operation: string; } ? true : false;

export type IsValidCreateOperation<T> = T extends { operation: "update" | "detach"; } ? false : true;

export type ValidCreateRelationOnly<T> = T extends { operation: "update" | "detach"; } ? never : T;

export type CreateEntityAttributes<T, TRelationKeys extends keyof T = never> = {
  [K in keyof T]: K extends TRelationKeys
  ? IsRelationOperation<T[K]> extends true
  ? ValidCreateRelationOnly<T[K]>
  : T[K]
  : T[K]
};

export interface BuildOnly<TModel, TRelations = {}> {
  build: () => MutationRequest<TModel, TRelations>;
  mutate: (options?: Partial<RequestConfig>) => Promise<MutationResponse>;
}

export type CreateOperationOnly = { operation: "create"; };
export type UpdateOperationOnly = { operation: "update"; };
export type AttachOperationOnly = { operation: "attach"; };
export type DetachOperationOnly = { operation: "detach"; };

export type ExcludeUpdateOperations<T> = T extends UpdateOperationOnly | DetachOperationOnly ? never : T;


