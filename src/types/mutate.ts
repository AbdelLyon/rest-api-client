
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
export interface CreateRelationOperationBase<T> {
  operation: "create";
  attributes: T;
}

export interface UpdateRelationOperationBase<T> {
  operation: "update";
  key: string | number;
  attributes: T;
}

export interface SyncRelationOperation<T> {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

export interface ToggleRelationOperation<T> {
  operation: "toggle";
  key: string | number;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

// Union des opérations de base sans les relations
export type RelationOperationBase<T> =
  | CreateRelationOperationBase<T>
  | UpdateRelationOperationBase<T>
  | AttachRelationOperation
  | DetachRelationOperation
  | SyncRelationOperation<T>
  | ToggleRelationOperation<T>;

// Type générique pour les opérations de relation
// Peut être étendu avec des relations typées spécifiques
export type RelationOperation<T> =
  RelationOperationBase<T>;

// Interface pour les données de mutation
export interface CreateMutationData<
  TAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: TRelations[K];
  };
};

export interface UpdateMutationData<
  TAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: TRelations[K];
  };
};

// Opérations de mutation
export interface CreateMutationOperation<
  TAttributes,
  TRelations extends Record<string, unknown>
> extends CreateMutationData<TAttributes, TRelations> {
  operation: "create";
};

export interface UpdateMutationOperation<
  TAttributes,
  TRelations extends Record<string, unknown>
> extends UpdateMutationData<TAttributes, TRelations> {
  operation: "update";
  key: string | number;
};

export type MutationOperation<
  TAttributes,
  TRelations extends Record<string, unknown>
> = CreateMutationOperation<TAttributes, TRelations> | UpdateMutationOperation<TAttributes, TRelations>;

// La requête de mutation
export interface MutationRequest<
  TAttributes,
  TRelations extends Record<string, unknown>
> {
  mutate: Array<MutationOperation<TAttributes, TRelations>>;
};

export interface MutationResponse<TModel> {
  data: Array<TModel>;
}