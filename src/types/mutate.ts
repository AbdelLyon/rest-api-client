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

// Opérations simples sans attributs typés
export interface AttachRelationOperation {
  operation: "attach";
  key: string | number;
}

export interface DetachRelationOperation {
  operation: "detach";
  key: string | number;
}

// Opérations avec attributs typés mais sans relations
export interface CreateRelationOperationBase<T extends ModelAttributes> {
  operation: "create";
  attributes: T;
}

export interface UpdateRelationOperationBase<T extends ModelAttributes> {
  operation: "update";
  key: string | number;
  attributes: T;
}

export interface SyncRelationOperation<T extends ModelAttributes> {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

export interface ToggleRelationOperation<T extends ModelAttributes> {
  operation: "toggle";
  key: string | number;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

// Union des opérations de base sans les relations
export type RelationOperationBase<T extends ModelAttributes = ModelAttributes> =
  | CreateRelationOperationBase<T>
  | UpdateRelationOperationBase<T>
  | AttachRelationOperation
  | DetachRelationOperation
  | SyncRelationOperation<T>
  | ToggleRelationOperation<T>;

// Type générique pour les opérations de relation
// Peut être étendu avec des relations typées spécifiques
export type RelationOperation<T extends ModelAttributes = ModelAttributes> =
  RelationOperationBase<T>;

// Interface pour les données de mutation
export interface CreateMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: TRelations[K];
  };
};

export interface UpdateMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: TRelations[K];
  };
};

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