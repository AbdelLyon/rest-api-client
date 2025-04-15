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

// Définition préliminaire pour permettre la référence circulaire
interface CreateRelationOperationBase<TAttributes extends ModelAttributes> {
  operation: "create";
  attributes: TAttributes;
  relations?: Record<string, unknown>;
}

interface UpdateRelationOperationBase<TAttributes extends ModelAttributes> {
  operation: "update";
  key: string | number;
  attributes: TAttributes;
  relations?: Record<string, unknown>;
}

// Union de toutes les opérations avec préservation du type générique
export type RelationOperation<TAttributes extends ModelAttributes = ModelAttributes> =
  | CreateRelationOperation<TAttributes>
  | UpdateRelationOperation<TAttributes>
  | AttachRelationOperation
  | DetachRelationOperation
  | SyncRelationOperation<TAttributes>
  | ToggleRelationOperation<TAttributes>;

// Maintenant, définir correctement les types avec relations préservant le type
export interface CreateRelationOperation<TAttributes extends ModelAttributes> extends CreateRelationOperationBase<TAttributes> {
  relations?: {
    [key: string]: RelationOperation<any> | Array<RelationOperation<any>>;
  };
}

export interface UpdateRelationOperation<TAttributes extends ModelAttributes> extends UpdateRelationOperationBase<TAttributes> {
  relations?: {
    [key: string]: RelationOperation<any> | Array<RelationOperation<any>>;
  };
}

// Redéfinition de RelationDefinition pour être compatible avec votre code existant
export interface RelationDefinition<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown> = {}
> {
  operation: RelationOperationType;
  key?: string | number;
  attributes?: TAttributes;
  relations?: {
    [K in keyof TRelations]: RelationOperation<any> | Array<RelationOperation<any>>;
  };
}

// Données pour une opération de mutation
export interface CreateMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: RelationOperation<any> | Array<RelationOperation<any>>;
  };
}

export interface UpdateMutationData<
  TAttributes extends ModelAttributes,
  TRelations extends Record<string, unknown>
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: RelationOperation<any> | Array<RelationOperation<any>>;
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