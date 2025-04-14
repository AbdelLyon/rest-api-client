// Type de base pour les attributs d'un modèle
export type ModelAttributes = Record<string, unknown>;

// Type de définition de relations récursives
export interface RelationDefinition<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations = unknown
> {
  attributes?: TAttributes;
  relations?: TRelations;
};

// Type récursif pour les relations
export type RecursiveRelations<TAttributes extends ModelAttributes = ModelAttributes> = Record<string, RelationDefinition<
  TAttributes,
  Record<string, RelationDefinition<TAttributes, unknown>>
>>;

// Types d'opérations de relation
export type RelationOperationType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

// Opération d'attachement d'une relation
export interface AttachRelationOperation {
  operation: "attach";
  key: string | number;
}

// Opération de détachement d'une relation
export interface DetachRelationOperation {
  operation: "detach";
  key: string | number;
}

// Opération de synchronisation d'une relation
export interface SyncRelationOperation<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations extends RecursiveRelations<TAttributes> = RecursiveRelations<TAttributes>,
  K extends keyof TRelations = keyof TRelations
> {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number;
  attributes?: TRelations[K]['attributes'];
  pivot?: Record<string, string | number>;
};

// Opération de basculement d'une relation
export interface ToggleRelationOperation<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations extends RecursiveRelations<TAttributes> = RecursiveRelations<TAttributes>,
  K extends keyof TRelations = keyof TRelations
> {
  operation: "toggle";
  key: string | number;
  attributes?: TRelations[K]['attributes'];
  pivot?: Record<string, string | number>;
};

// Déclaration préliminaire pour la récursivité
export interface CreateRelationOperation<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations extends RecursiveRelations<TAttributes> = RecursiveRelations<TAttributes>
> {
  operation: "create";
  attributes?: Record<string, unknown>;
  relations?: {
    [K in keyof TRelations]?:
    | RelationOperation<TAttributes, TRelations>
    | Array<RelationOperation<TAttributes, TRelations>>
  };
}

// Type d'union pour toutes les opérations de relation possibles
export type RelationOperation<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations extends RecursiveRelations<TAttributes> = RecursiveRelations<TAttributes>
> =
  | CreateRelationOperation<TAttributes, TRelations>
  | AttachRelationOperation
  | DetachRelationOperation
  | SyncRelationOperation<TAttributes, TRelations>
  | ToggleRelationOperation<TAttributes, TRelations>;

// Données de base pour une mutation
export interface BaseMutationData<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations extends RecursiveRelations<TAttributes> = RecursiveRelations<TAttributes>
> {
  attributes?: TAttributes;
  relations?: {
    [K in keyof TRelations]?:
    | RelationOperation<TAttributes, TRelations>
    | Array<RelationOperation<TAttributes, TRelations>>
  };
}

// Opération de création pour une mutation
export interface CreateMutationOperation<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations extends RecursiveRelations<TAttributes> = RecursiveRelations<TAttributes>
> extends BaseMutationData<TAttributes, TRelations> {
  operation: "create";
};

// Opération de mise à jour pour une mutation
export interface UpdateMutationOperation<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations extends RecursiveRelations<TAttributes> = RecursiveRelations<TAttributes>
> extends BaseMutationData<TAttributes, TRelations> {
  operation: "update";
  key: string | number;
};

// Type d'union pour toutes les opérations de mutation
export type MutationOperation<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations extends RecursiveRelations<TAttributes> = RecursiveRelations<TAttributes>
> =
  | CreateMutationOperation<TAttributes, TRelations>
  | UpdateMutationOperation<TAttributes, TRelations>;

// Interface pour une requête de mutation
export interface MutationRequest<
  TAttributes extends ModelAttributes = ModelAttributes,
  TRelations extends RecursiveRelations<TAttributes> = RecursiveRelations<TAttributes>
> {
  mutate: Array<MutationOperation<TAttributes, TRelations>>;
};

// Interface pour une réponse de mutation
export interface MutationResponse<TModel> {
  data: Array<TModel>;
}

// Type auxiliaire pour les attributs de relation
export type RelationAttributes<T> = {
  [K in keyof T]: T[K];
};