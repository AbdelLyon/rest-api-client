// Relations génériques
export type RelationsConfig = Record<string, unknown>;

export type RelationAttributesMap<T> = {
  [K in keyof T]: T[K];
};

// Le reste du code reste identique
export type OperationType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

export interface AttachRelation {
  operation: "attach";
  key: string | number;
}

export interface DetachRelation {
  operation: "detach";
  key: string | number;
}

export interface SyncRelation<T, K extends keyof T> {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number;
  attributes?: T[K];
  pivot?: Record<string, string | number>;
}

export interface ToggleRelation<T, K extends keyof T> {
  operation: "toggle";
  key: string | number;
  attributes?: T[K];
  pivot?: Record<string, string | number>;
}

export interface CreateRelation<TAttributes, TRelations> {
  operation: "create";
  attributes?: TRelations[keyof TRelations];
  relations?: Partial<
    Record<
      keyof TRelations,
      | RelationOperation<TAttributes, TRelations>
      | Array<RelationOperation<TAttributes, TRelations>>
    >
  >;
}

export type RelationOperation<TAttributes, TRelations> =
  | CreateRelation<TAttributes, TRelations>
  | AttachRelation
  | DetachRelation
  | SyncRelation<TRelations, keyof TRelations>
  | ToggleRelation<TRelations, keyof TRelations>;

export interface BaseMutationOperation<TAttributes, TRelations> {
  attributes?: TAttributes;
  relations?: Partial<
    Record<
      keyof TRelations,
      | RelationOperation<TAttributes, TRelations>
      | Array<RelationOperation<TAttributes, TRelations>>
    >
  >;
}

export interface CreateOperation<TAttributes, TRelations>
  extends BaseMutationOperation<TAttributes, TRelations> {
  operation: "create";
}

export interface UpdateOperation<TAttributes, TRelations>
  extends BaseMutationOperation<TAttributes, TRelations> {
  operation: "update";
  key: string | number;
}

export type MutationOperation<TAttributes, TRelations> =
  | CreateOperation<TAttributes, TRelations>
  | UpdateOperation<TAttributes, TRelations>;

export interface MutateRequest<TAttributes, TRelations> {
  mutate: Array<MutationOperation<TAttributes, TRelations>>;
}

export interface MutateResponse<T> {
  data: Array<T>;
}
