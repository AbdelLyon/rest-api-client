// Types d'opérations possibles
export type RelationOperationType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

// Opérations communes pour toutes les relations
interface BaseRelationOperation {
  operation: RelationOperationType;
}

// Opérations simples sans attributs
export interface AttachRelationOperation extends BaseRelationOperation {
  operation: "attach";
  key: string | number;
}

export interface DetachRelationOperation extends BaseRelationOperation {
  operation: "detach";
  key: string | number;
}

// Opérations avec attributs typés
export interface CreateRelationOperationBase<T> extends BaseRelationOperation {
  operation: "create";
  attributes: T;
}

export interface UpdateRelationOperationBase<T> extends BaseRelationOperation {
  operation: "update";
  key: string | number;
  attributes: T;
}

export interface SyncRelationOperation<T> extends BaseRelationOperation {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

export interface ToggleRelationOperation<T> extends BaseRelationOperation {
  operation: "toggle";
  key: string | number;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

// Type générique conditionnel basé sur le contexte
export type RelationOperation<T, InCreateContext extends boolean = false> =
  InCreateContext extends true
  ? (CreateRelationOperationBase<T> & {
    relations?: { [key: string]: RelationOperation<any, true>; };
  }) | AttachRelationOperation
  : (CreateRelationOperationBase<T> & {
    relations?: { [key: string]: RelationOperation<any, false>; };
  }) | (UpdateRelationOperationBase<T> & {
    relations?: { [key: string]: RelationOperation<any, false>; };
  }) | AttachRelationOperation | DetachRelationOperation | SyncRelationOperation<T> | ToggleRelationOperation<T>;

// Interface pour les données de mutation
export interface MutationData<
  TAttributes,
  TRelations,
  InCreateContext extends boolean
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: TRelations[K] extends RelationOperation<infer T, any>
    ? RelationOperation<T, InCreateContext>
    : never
  };
};

// Opérations de mutation
export interface CreateMutationOperation<
  TAttributes,
  TRelations
> extends MutationData<TAttributes, TRelations, true> {
  operation: "create";
};

export interface UpdateMutationOperation<
  TAttributes,
  TRelations
> extends MutationData<TAttributes, TRelations, false> {
  operation: "update";
  key: string | number;
};

export type MutationOperation<
  TAttributes,
  TRelations
> = CreateMutationOperation<TAttributes, TRelations> | UpdateMutationOperation<TAttributes, TRelations>;

// La requête de mutation
export interface MutationRequest<
  TAttributes,
  TRelations
> {
  mutate: Array<MutationOperation<TAttributes, TRelations>>;
};

export interface MutationResponse<TModel> {
  data: Array<TModel>;
}