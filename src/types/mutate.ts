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

// Opérations simples sans attributs
export interface AttachRelationOperation {
  operation: "attach";
  key: string | number;
}

export interface DetachRelationOperation {
  operation: "detach";
  key: string | number;
}

// Interface générique pour les relations
export type RelationsMap<T extends ModelAttributes = ModelAttributes> = {
  [key: string]: RelationOperation<T> | RelationOperation<T>[];
};

// Opérations avec attributs génériques
export interface CreateRelationOperation<T extends ModelAttributes = ModelAttributes> {
  operation: "create";
  attributes: T;
  relations?: RelationsMap;
}

export interface UpdateRelationOperation<T extends ModelAttributes = ModelAttributes> {
  operation: "update";
  key: string | number;
  attributes: T;
  relations?: RelationsMap;
}

export interface SyncRelationOperation<T extends ModelAttributes = ModelAttributes> {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

export interface ToggleRelationOperation<T extends ModelAttributes = ModelAttributes> {
  operation: "toggle";
  key: string | number;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

// Union de tous les types d'opérations
export type RelationOperation<T extends ModelAttributes = ModelAttributes> =
  | CreateRelationOperation<T>
  | UpdateRelationOperation<T>
  | AttachRelationOperation
  | DetachRelationOperation
  | SyncRelationOperation<T>
  | ToggleRelationOperation<T>;

// Interface pour les données de mutation
export interface CreateMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: RelationOperation<ModelAttributes> | RelationOperation<ModelAttributes>[];
  };
}

export interface UpdateMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: RelationOperation<ModelAttributes> | RelationOperation<ModelAttributes>[];
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

// Interface RelationDefinition pour la compatibilité avec le code existant
export interface RelationDefinition<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown> = {}
> {
  operation: RelationOperationType;
  key?: string | number;
  attributes?: TAttributes;
  relations?: {
    [K in keyof TRelations]: RelationOperation<ModelAttributes> | RelationOperation<ModelAttributes>[];
  };
}