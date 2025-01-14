// Types de base pour les opérations
export type OperationType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

export interface AttachRelation {
  operation: "attach";
  key: number;
}

export interface DetachRelation {
  operation: "detach";
  key: number;
}

// Relations
export interface CreateRelation<
  TAttributes,
  TRelations,
  TRelationAttributes = unknown,
> {
  operation: "create";
  attributes?: TRelationAttributes;
  relations?: Partial<
    Record<
      keyof TRelations,
      | RelationOperation<TAttributes, TRelations>
      | Array<RelationOperation<TAttributes, TRelations>>
    >
  >;
}

export interface SyncRelation<TRelationAttributes = unknown> {
  operation: "sync";
  without_detaching?: boolean;
  key: number;
  attributes?: TRelationAttributes;
  pivot?: Record<string, string | number>;
}

export interface ToggleRelation<TRelationAttributes = unknown> {
  operation: "toggle";
  key: number;
  attributes?: TRelationAttributes;
  pivot?: Record<string, string | number>;
}

export type RelationOperation<
  TAttributes,
  TRelations,
  TRelationAttributesMap extends Record<keyof TRelations, unknown> = Record<
    keyof TRelations,
    unknown
  >,
> =
  | CreateRelation<
      TAttributes,
      TRelations,
      TRelationAttributesMap[keyof TRelations]
    >
  | AttachRelation
  | DetachRelation
  | SyncRelation<TRelationAttributesMap[keyof TRelations]>
  | ToggleRelation<TRelationAttributesMap[keyof TRelations]>;
// Opérations principales
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
  key: number;
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
