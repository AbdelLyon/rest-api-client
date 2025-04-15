// Type de base pour les attributs
export type ModelAttributes = Record<string, unknown>;

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

// Définir un type récursif pour les maps de relations
// Utilisation de Partial rend toutes les propriétés optionnelles
export type RecursiveRelationsMap<T extends ModelAttributes> = {
  [key: string]: RelationOperation<T> | Array<RelationOperation<T>>;
};

// Opération générique avec générique pour les attributs
export interface CreateRelationOperation<TAttributes extends ModelAttributes> {
  operation: "create";
  attributes: TAttributes;
  relations?: RecursiveRelationsMap<ModelAttributes>;
}

export interface UpdateRelationOperation<TAttributes extends ModelAttributes> {
  operation: "update";
  key: string | number;
  attributes: TAttributes;
  relations?: RecursiveRelationsMap<ModelAttributes>;
}

// Union de toutes les opérations avec préservation du type générique
export type RelationOperation<TAttributes extends ModelAttributes = ModelAttributes> =
  | CreateRelationOperation<TAttributes>
  | UpdateRelationOperation<TAttributes>
  | AttachRelationOperation
  | DetachRelationOperation
  | SyncRelationOperation<TAttributes>
  | ToggleRelationOperation<TAttributes>;


// Données pour une opération de mutation
export interface CreateMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: RelationOperation<ModelAttributes> | Array<RelationOperation<ModelAttributes>>;
  };
}

export interface UpdateMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: RelationOperation<ModelAttributes> | Array<RelationOperation<ModelAttributes>>;
  };
}

// Opérations de mutation
export interface CreateMutationOperation<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> extends CreateMutationData<TAttributes, TRelations> {
  operation: "create";
};

export interface UpdateMutationOperation<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> extends UpdateMutationData<TAttributes, TRelations> {
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