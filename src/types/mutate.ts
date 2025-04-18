import { RequestConfig } from "./common";

export type RelationDefinitionType =
  | "create"
  | "update"
  | "attach"
  | "detach"
  | "sync"
  | "toggle";

interface BaseRelationDefinition {
  operation: RelationDefinitionType;
}

export interface AttachRelationDefinition extends BaseRelationDefinition {
  operation: "attach";
  key: string | number;
}

export interface DetachRelationDefinition extends BaseRelationDefinition {
  operation: "detach";
  key: string | number;
}

export interface CreateRelationDefinitionBase<T> extends BaseRelationDefinition {
  operation: "create";
  attributes: T;
}

export interface UpdateRelationDefinitionBase<T> extends BaseRelationDefinition {
  operation: "update";
  key: string | number;
  attributes: T;
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



export interface MutationData<
  TAttributes,
  TRelations,
  InCreateContext extends boolean
> {
  attributes: TAttributes;
  relations?: {
    [K in keyof TRelations]: TRelations[K] extends RelationDefinition<infer T, any>
    ? RelationDefinition<T, InCreateContext>
    : never
  };
};

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

export interface MutationOperation<TAttributes> {
  operation: "create" | "update";
  attributes: TAttributes;
  relations?: Record<string, any>;
  key?: string | number;
}



export interface MutationResponse {
  created: Array<string | number>;
  updated: Array<string | number>;
}


export type ExtractModelAttributes<T> = Omit<T, 'relations'>;

export type RelationDefinition<T = unknown, R = unknown> =
  | { operation: "create"; attributes: T; relations?: Record<string, RelationDefinition<R, unknown>>; __relationDefinition?: true; }
  | { operation: "update"; key: string | number; attributes: T; relations?: Record<string, RelationDefinition<R, unknown>>; __relationDefinition?: true; }
  | AttachRelationDefinition
  | DetachRelationDefinition
  | SyncRelationDefinition<T>
  | ToggleRelationDefinition<T>;

// Type plus précis pour les opérations de mutation avec relations typées
export type TypedMutationOperation<TModel, TRelations = {}> = {
  operation: "create" | "update";
  key?: string | number;
  attributes: ExtractModelAttributes<TModel>;
  relations: TRelations;
};

// Type pour le format final de la requête de mutation
export type MutationRequest<TModel, TRelations = {}> = {
  mutate: Array<TypedMutationOperation<TModel, TRelations>>;
};

// Interface pour la fonction de mutation
export interface MutationFunction {
  (data: any, options?: Partial<RequestConfig>): Promise<MutationResponse>;
}


export type CreateRelationOperation<T> = {
  operation: "create";
  attributes: T;
  __relationDefinition?: true;
};

export type UpdateRelationOperation<T> = {
  operation: "update";
  key: string | number;
  attributes: T;
  __relationDefinition?: true;
};

export type AttachRelationOperation = {
  operation: "attach";
  key: string | number;
  __relationDefinition?: true;
};

export type DetachRelationOperation = {
  operation: "detach";
  key: string | number;
  __relationDefinition?: true;
};

// Les types d'opérations valides pour des relations imbriquées
export type NestedRelationOperation<T> =
  | CreateRelationOperation<T>
  | AttachRelationOperation;


// Interface pour les méthodes de relation uniquement
export interface IRelationBuilder {
  createRelation<T, R = unknown>(
    attributes: T,
    relations?: Record<string, NestedRelationOperation<R>>
  ): T & CreateRelationOperation<T> & {
    relations?: Record<string, NestedRelationOperation<R>>;
  };

  // Pour mettre à jour une relation (de premier niveau)
  updateRelation<T, R = unknown>(
    key: string | number,
    attributes: T,
    relations?: Record<string, NestedRelationOperation<R>>
  ): T & UpdateRelationOperation<T> & {
    relations?: Record<string, NestedRelationOperation<R>>;
  };

  // Ces opérations ne peuvent pas contenir de relations imbriquées
  attach(key: string | number): AttachRelationOperation;
  detach(key: string | number): DetachRelationOperation;

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

export interface BuildOnly<TModel, TRelations = {}> {
  build(): MutationRequest<TModel, TRelations>;
  mutate(options?: Partial<RequestConfig>): Promise<MutationResponse>;
}

type IsRelationOperation<T> = T extends { operation: string; } ? true : false;

type IsValidCreateOperation<T> = T extends { operation: "update" | "detach"; } ? false : true;
type CreateEntityAttributes<T, RelationKeys extends keyof T = never> = {
  [K in keyof T]: K extends RelationKeys
  ? IsRelationOperation<T[K]> extends true
  ? IsValidCreateOperation<T[K]> extends true
  ? T[K]
  : never
  : T[K]
  : T[K]
};


export interface IEntityBuilder<TModel> {
  createEntity<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
    attributes: CreateEntityAttributes<T, RelationKeys>
  ): BuildOnly<TModel, Pick<T, Extract<RelationKeys, string>>>;

  updateEntity<T extends Record<string, unknown>>(
    key: string | number,
    attributes: T
  ): IEntityBuilder<TModel>;

  build(): MutationRequest<TModel>;

  setMutationFunction(fn: MutationFunction): void;
}

// Interface pour les méthodes d'entité
export interface IEntityBuilder<TModel> {
  createEntity<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
    attributes: {
      [K in keyof T]: K extends RelationKeys
      ? T[K] extends { operation: string; }
      ? T[K] extends { operation: "update"; } | { operation: "detach"; }
      ? never
      : T[K]
      : T[K]
      : T[K]
    }
  ): BuildOnly<TModel, Pick<T, Extract<RelationKeys, string>>>;

  updateEntity<T extends Record<string, unknown>>(
    key: string | number,
    attributes: T
  ): IEntityBuilder<TModel>;

  build(): MutationRequest<TModel>;

  setMutationFunction(fn: MutationFunction): void;
}

export type RelationResult<T, Op extends string> = T & {
  operation: Op;
};