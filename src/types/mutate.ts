// Type de base pour les attributs
export type ModelAttributes = Record<string, unknown>;

// Définition d'une relation avec typage générique
export interface RelationDefinition<TAttributes extends ModelAttributes, TRelations extends Record<string, unknown>> {
  attributes: TAttributes;
  relations?: TRelations;
}

// Types d'opérations possibles
export type RelationOperationType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

// Opération d'attachement
export interface AttachRelationOperation {
  operation: "attach";
  key: string | number;
}

// Opération de détachement
export interface DetachRelationOperation {
  operation: "detach";
  key: string | number;
}

// Opération de synchronisation avec typage générique
export interface SyncRelationOperation<TAttributes extends ModelAttributes> {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number;
  attributes?: TAttributes;
  pivot?: Record<string, string | number>;
}

// Opération de basculement avec typage générique
export interface ToggleRelationOperation<TAttributes extends ModelAttributes> {
  operation: "toggle";
  key: string | number;
  attributes?: TAttributes;
  pivot?: Record<string, string | number>;
}

// Opération de création avec typage plus simple
export interface CreateRelationOperation<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  operation: "create";
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]?: RelationOperation<any, any> | Array<RelationOperation<any, any>>;
  };
}

// Union de toutes les opérations possibles avec typage générique
export type RelationOperation<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations extends Record<string, unknown> = Record<string, unknown>
> =
  | CreateRelationOperation<TAttributes, TRelations>
  | AttachRelationOperation
  | DetachRelationOperation
  | SyncRelationOperation<TAttributes>
  | ToggleRelationOperation<TAttributes>;

// Données pour une opération de mutation avec typage simplifié
export interface BaseMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]?: RelationOperation<any, any> | Array<RelationOperation<any, any>>;
  };
}

// Opération de création avec typage générique
export interface CreateMutationOperation<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> extends BaseMutationData<TAttributes, TRelations> {
  operation: "create";
};

// Opération de mise à jour avec typage générique
export interface UpdateMutationOperation<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> extends BaseMutationData<TAttributes, TRelations> {
  operation: "update";
  key: string | number;
};

// Union des opérations de mutation avec typage générique
export type MutationOperation<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> = CreateMutationOperation<TAttributes, TRelations> | UpdateMutationOperation<TAttributes, TRelations>;

// La requête de mutation avec typage générique
export interface MutationRequest<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  mutate: Array<MutationOperation<TAttributes, TRelations>>;
};

export interface MutationResponse<TModel> {
  data: Array<TModel>;
}