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

// Relations pour opérations de création
export interface CreateRelationsMap {
  [key: string]: CreateRelationOperation | AttachRelationOperation | Array<CreateRelationOperation | AttachRelationOperation>;
}

// Relations pour opérations de mise à jour
export interface UpdateRelationsMap {
  [key: string]: RelationOperation | Array<RelationOperation>;
}

// Opération de création avec contraintes sur les relations
export interface CreateRelationOperation<
  TAttributes extends ModelAttributes = ModelAttributes
> {
  operation: "create";
  attributes: TAttributes;
  relations?: CreateRelationsMap; // Limité aux opérations de création/attachement
};

// Opération de mise à jour avec toutes les opérations possibles
export interface UpdateRelationOperation<
  TAttributes extends ModelAttributes = ModelAttributes
> {
  operation: "update";
  key: string | number;
  attributes: TAttributes;
  relations?: UpdateRelationsMap; // Permet toutes les opérations
};

// Union de toutes les opérations
export type RelationOperation =
  | CreateRelationOperation
  | UpdateRelationOperation
  | AttachRelationOperation
  | DetachRelationOperation
  | SyncRelationOperation<ModelAttributes>
  | ToggleRelationOperation<ModelAttributes>;

// Données pour une opération de mutation de création
export interface CreateMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: CreateRelationOperation | AttachRelationOperation | Array<CreateRelationOperation | AttachRelationOperation>;
  };
}

// Données pour une opération de mutation de mise à jour
export interface UpdateMutationData<
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