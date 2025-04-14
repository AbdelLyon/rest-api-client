// Type de base pour les attributs
export type ModelAttributes = Record<string, unknown>;

// Définition de relation simplifiée
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

// Opérations simples
export interface AttachRelationOperation {
  operation: "attach";
  key: string | number;
}

export interface DetachRelationOperation {
  operation: "detach";
  key: string | number;
}

export interface SyncRelationOperation<TAttributes extends ModelAttributes> {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number;
  attributes?: TAttributes;
  pivot?: Record<string, string | number>;
}

export interface ToggleRelationOperation<TAttributes extends ModelAttributes> {
  operation: "toggle";
  key: string | number;
  attributes?: TAttributes;
  pivot?: Record<string, string | number>;
}

// Interface pour les relations dans CreateRelationOperation
export interface RelationsMap {
  [key: string]: RelationOperation | Array<RelationOperation>;
}

// Opération de création
export interface CreateRelationOperation<
  TAttributes extends ModelAttributes = ModelAttributes
> {
  operation: "create";
  attributes: TAttributes;
  relations?: RelationsMap;
};

// Union de toutes les opérations
export type RelationOperation =
  | CreateRelationOperation
  | AttachRelationOperation
  | DetachRelationOperation
  | SyncRelationOperation<ModelAttributes>
  | ToggleRelationOperation<ModelAttributes>;

// Données pour une opération de mutation
export interface BaseMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: RelationOperation | Array<RelationOperation>;
  };
}

// Opérations de mutation
export interface CreateMutationOperation<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> extends BaseMutationData<TAttributes, TRelations> {
  operation: "create";
};

export interface UpdateMutationOperation<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> extends BaseMutationData<TAttributes, TRelations> {
  operation: "update";
  key: string | number;
};

export type MutationOperation<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> = CreateMutationOperation<TAttributes, TRelations> | UpdateMutationOperation<TAttributes, TRelations>;

// La requête de mutation
export interface MutationRequest<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  mutate: Array<MutationOperation<TAttributes, TRelations>>;
};

export interface MutationResponse<TModel> {
  data: Array<TModel>;
}