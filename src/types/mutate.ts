export type RelationDefinitions = Record<string, unknown>;

export type RelationAttributes<T> = {
  [K in keyof T]: T[K];
};

export type RelationOperationType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

export interface AttachRelationOperation {
  operation: "attach";
  key: string | number;
}

export interface DetachRelationOperation {
  operation: "detach";
  key: string | number;
}

export interface SyncRelationOperation<T, K extends keyof T> {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number;
  attributes?: T[K];
  pivot?: Record<string, string | number>;
}

export interface ToggleRelationOperation<T, K extends keyof T> {
  operation: "toggle";
  key: string | number;
  attributes?: T[K];
  pivot?: Record<string, string | number>;
}

export interface CreateRelationOperation<TModelAttributes, TRelations> {
  operation: "create";
  attributes?: TRelations[keyof TRelations];
  relations?: Partial<
    Record<
      keyof TRelations,
      | RelationOperation<TModelAttributes, TRelations>
      | Array<RelationOperation<TModelAttributes, TRelations>>
    >
  >;
}

export type RelationOperation<TModelAttributes, TRelations> =
  | CreateRelationOperation<TModelAttributes, TRelations>
  | AttachRelationOperation
  | DetachRelationOperation
  | SyncRelationOperation<TRelations, keyof TRelations>
  | ToggleRelationOperation<TRelations, keyof TRelations>;

export interface BaseMutationData<TModelAttributes, TRelations> {
  attributes?: TModelAttributes;
  relations?: Partial<
    Record<
      keyof TRelations,
      | RelationOperation<TModelAttributes, TRelations>
      | Array<RelationOperation<TModelAttributes, TRelations>>
    >
  >;
}

export interface CreateMutationOperation<TModelAttributes, TRelations>
  extends BaseMutationData<TModelAttributes, TRelations> {
  operation: "create";
}

export interface UpdateMutationOperation<TModelAttributes, TRelations>
  extends BaseMutationData<TModelAttributes, TRelations> {
  operation: "update";
  key: string | number;
}

export type MutationOperation<TModelAttributes, TRelations> =
  | CreateMutationOperation<TModelAttributes, TRelations>
  | UpdateMutationOperation<TModelAttributes, TRelations>;

export interface MutationRequest<TModelAttributes, TRelations> {
  mutate: Array<MutationOperation<TModelAttributes, TRelations>>;
}

export interface MutationResponse<TModel> {
  data: Array<TModel>;
}
