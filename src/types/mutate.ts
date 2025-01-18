// Types de base
export type OperationType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

// Relations de base (sans attributs)
export interface AttachRelation {
  operation: "attach";
  key: string | number;
}

export interface DetachRelation {
  operation: "detach";
  key: string | number;
}

// Relations avec attributs
export interface SyncRelation<TRelationAttributes> {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number;
  attributes?: TRelationAttributes;
  pivot?: Record<string, string | number>;
}

export interface ToggleRelation<TRelationAttributes> {
  operation: "toggle";
  key: string | number;
  attributes?: TRelationAttributes;
  pivot?: Record<string, string | number>;
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

// Type d'opération de relation
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

// Opérations de mutation
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
  key: string | number;
}

// Types d'opération de mutation
export type MutationOperation<
  TAttributes,
  TRelations,
  TRelationAttributesMap extends Record<keyof TRelations, unknown>,
> =
  | CreateOperation<TAttributes, TRelations, TRelationAttributesMap>
  | UpdateOperation<TAttributes, TRelations, TRelationAttributesMap>;

// Types de requête et réponse
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
