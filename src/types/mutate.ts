import { RequestConfig } from "./common";

// ------------- Types de base pour les relations -------------

export type RelationDefinitionType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

// Base pour toutes les définitions de relation
interface BaseRelationDefinition {
  operation: RelationDefinitionType;
  __relationDefinition?: true; // Marqueur interne, défini comme non-énumérable
}

// Types spécifiques pour chaque opération de relation
export interface AttachRelationDefinition extends BaseRelationDefinition {
  operation: "attach";
  key: string | number;
}

export interface DetachRelationDefinition extends BaseRelationDefinition {
  operation: "detach";
  key: string | number;
}

export interface CreateRelationOperation<T> extends BaseRelationDefinition {
  operation: "create";
  attributes: T;
  // relations sera défini séparément selon le contexte
}

export interface UpdateRelationOperation<T> extends BaseRelationDefinition {
  operation: "update";
  key: string | number;
  attributes: T;
  // relations sera défini séparément selon le contexte
}

export interface SyncRelationDefinition<T> extends BaseRelationDefinition {
  operation: "sync";
  without_detaching?: boolean;
  key: string | number | Array<string | number>;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

export interface ToggleRelationDefinition<T> extends BaseRelationDefinition {
  operation: "toggle";
  key: string | number | Array<string | number>;
  attributes?: T;
  pivot?: Record<string, string | number>;
}

// ------------- Types pour les relations selon le contexte -------------

// Relations valides dans un contexte de création
export type ValidCreateNestedRelation<T> =
  | (CreateRelationOperation<T> & { relations?: Record<string, ValidCreateNestedRelation<any>>; })
  | AttachRelationDefinition;

// Relations valides dans un contexte de mise à jour
export type ValidUpdateNestedRelation<T> =
  | (CreateRelationOperation<T> & { relations?: Record<string, ValidCreateNestedRelation<any>>; })
  | (UpdateRelationOperation<T> & { relations?: Record<string, ValidUpdateNestedRelation<any>>; })
  | AttachRelationDefinition
  | DetachRelationDefinition
  | SyncRelationDefinition<T>
  | ToggleRelationDefinition<T>;

// Type général pour une définition de relation (utilisé principalement pour la rétrocompatibilité)
export type RelationDefinition<T = unknown, InCreateContext extends boolean = false> =
  InCreateContext extends true
  ? ValidCreateNestedRelation<T>
  : ValidUpdateNestedRelation<T>;

// ------------- Types pour les opérations de mutation -------------

export type ExtractModelAttributes<T> = Omit<T, 'relations'>;

// Type précis pour les opérations de mutation
export type TypedMutationOperation<TModel, TRelations = {}> = {
  operation: "create" | "update";
  key?: string | number;
  attributes: ExtractModelAttributes<TModel>;
  relations: TRelations;
};

// Format de la requête de mutation
export type MutationRequest<TModel, TRelations = {}> = {
  mutate: Array<TypedMutationOperation<TModel, TRelations>>;
};

// Interface pour la fonction de mutation
export interface MutationFunction {
  (data: any, options?: Partial<RequestConfig>): Promise<MutationResponse>;
}

// Réponse à une opération de mutation
export interface MutationResponse {
  created: Array<string | number>;
  updated: Array<string | number>;
}

// ------------- Types utilitaires pour les validations -------------

// Vérifie si un type est une opération de relation
export type IsRelationOperation<T> = T extends { operation: string; } ? true : false;

// Vérifie si une opération est valide dans un contexte de création
export type IsValidCreateOperation<T> = T extends { operation: "update" | "detach"; } ? false : true;

// Transforme les attributs pour valider les opérations dans un contexte de création
export type ValidCreateRelationOnly<T> = T extends { operation: "update" | "detach"; }
  ? never  // Rejeter toute opération "update" ou "detach"
  : T;

// Modifier le type CreateEntityAttributes pour qu'il vérifie récursivement
export type CreateEntityAttributes<T, RelationKeys extends keyof T = never> = {
  [K in keyof T]: K extends RelationKeys
  ? IsRelationOperation<T[K]> extends true
  ? ValidCreateRelationOnly<T[K]>  // Rejeter les opérations update/detach
  : T[K]
  : T[K]
};
// ------------- Interfaces pour les builders -------------

// Interface pour les méthodes de relation
export interface IRelationBuilder {
  createRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
    attributes: T,
    relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>
  ): T & CreateRelationOperation<T> & {
    relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>;
  };

  updateRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
    key: string | number,
    attributes: T,
    relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>
  ): T & UpdateRelationOperation<T> & {
    relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>;
  };

  attach(key: string | number): AttachRelationDefinition;
  detach(key: string | number): DetachRelationDefinition;

  sync<T>(
    key: string | number | Array<string | number>,
    attributes?: T,
    pivot?: Record<string, string | number>,
    withoutDetaching?: boolean
  ): SyncRelationDefinition<T>;

  toggle<T>(
    key: string | number | Array<string | number>,
    attributes?: T,
    pivot?: Record<string, string | number>
  ): ToggleRelationDefinition<T>;
}

// Interface qui expose uniquement build() et mutate()
export interface BuildOnly<TModel, TRelations = {}> {
  build(): MutationRequest<TModel, TRelations>;
  mutate(options?: Partial<RequestConfig>): Promise<MutationResponse>;
}

export type CreateOperationOnly = { operation: "create"; };
export type UpdateOperationOnly = { operation: "update"; };
export type AttachOperationOnly = { operation: "attach"; };
export type DetachOperationOnly = { operation: "detach"; };

// Type utilitaire qui exclut strictement les opérations update/detach
export type ExcludeUpdateOperations<T> = T extends UpdateOperationOnly | DetachOperationOnly ? never : T;


// Interface pour les méthodes d'entité
export interface IEntityBuilder<TModel> {
  createEntity<
    TAttributes extends Record<string, unknown>,
    TRelations extends Record<string, any> = {}
  >(
    options: {
      attributes: TAttributes;
      relations?: {
        [K in keyof TRelations]:
        | ReturnType<IRelationBuilder['createRelation']>
        | ReturnType<IRelationBuilder['attach']>;
      };
    }
  ): BuildOnly<TModel, TRelations>;

  updateEntity<T extends Record<string, unknown>>(
    key: string | number,
    attributes: T
  ): IEntityBuilder<TModel>;

  build(): MutationRequest<TModel>;

  setMutationFunction(fn: MutationFunction): void;
}

// Type utilitaire pour simplifier les signatures de retour
export type RelationResult<T, Op extends string> = T & {
  operation: Op;
  // Autres propriétés selon le type d'opération
};