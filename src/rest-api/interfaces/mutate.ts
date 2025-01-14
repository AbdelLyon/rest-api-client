// Types de base pour les opérations
export type OperationType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

// Types de base pour les relations
export interface AttachRelation {
  operation: "attach";
  key: number;
}

export interface DetachRelation {
  operation: "detach";
  key: number;
}

export interface CreateRelation<
  TAttributes,
  TRelations,
  TRelationAttributesMap extends Record<keyof TRelations, unknown>,
> {
  operation: "create";
  attributes?: TRelationAttributesMap[keyof TRelations];
  relations?: Partial<
    Record<
      keyof TRelations,
      | RelationOperation<TAttributes, TRelations, TRelationAttributesMap>
      | Array<
          RelationOperation<TAttributes, TRelations, TRelationAttributesMap>
        >
    >
  >;
}

export interface SyncRelation<TRelationAttributes> {
  operation: "sync";
  without_detaching?: boolean;
  key: number;
  attributes?: TRelationAttributes;
  pivot?: Record<string, string | number>;
}

export interface ToggleRelation<TRelationAttributes> {
  operation: "toggle";
  key: number;
  attributes?: TRelationAttributes;
  pivot?: Record<string, string | number>;
}

export type RelationOperation<
  TAttributes,
  TRelations,
  TRelationAttributesMap extends Record<keyof TRelations, unknown>,
> =
  | CreateRelation<TAttributes, TRelations, TRelationAttributesMap>
  | AttachRelation
  | DetachRelation
  | SyncRelation<TRelationAttributesMap[keyof TRelations]>
  | ToggleRelation<TRelationAttributesMap[keyof TRelations]>;

// Opérations principales
export interface BaseMutationOperation<
  TAttributes,
  TRelations,
  TRelationAttributesMap extends Record<keyof TRelations, unknown>,
> {
  attributes?: TAttributes;
  relations?: Partial<
    Record<
      keyof TRelations,
      | RelationOperation<TAttributes, TRelations, TRelationAttributesMap>
      | Array<
          RelationOperation<TAttributes, TRelations, TRelationAttributesMap>
        >
    >
  >;
}

export interface CreateOperation<
  TAttributes,
  TRelations,
  TRelationAttributesMap extends Record<keyof TRelations, unknown>,
> extends BaseMutationOperation<
    TAttributes,
    TRelations,
    TRelationAttributesMap
  > {
  operation: "create";
}

export interface UpdateOperation<
  TAttributes,
  TRelations,
  TRelationAttributesMap extends Record<keyof TRelations, unknown>,
> extends BaseMutationOperation<
    TAttributes,
    TRelations,
    TRelationAttributesMap
  > {
  operation: "update";
  key: number;
}

export type MutationOperation<
  TAttributes,
  TRelations,
  TRelationAttributesMap extends Record<keyof TRelations, unknown>,
> =
  | CreateOperation<TAttributes, TRelations, TRelationAttributesMap>
  | UpdateOperation<TAttributes, TRelations, TRelationAttributesMap>;

export interface MutateRequest<
  TAttributes,
  TRelations,
  TRelationAttributesMap extends Record<keyof TRelations, unknown>,
> {
  mutate: Array<
    MutationOperation<TAttributes, TRelations, TRelationAttributesMap>
  >;
}

export interface MutateResponse<T> {
  data: Array<T>;
}
