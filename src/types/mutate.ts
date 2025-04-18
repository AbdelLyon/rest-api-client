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

// Interface pour les méthodes de relation uniquement
export interface IRelationBuilder {
  createRelation<T, R = unknown>(
    attributes: T,
    relations?: Record<string, RelationDefinition<R, unknown>>
  ): T & {
    operation: "create";
    attributes: T;
    relations?: Record<string, RelationDefinition<R, unknown>>;
    __relationDefinition?: true;
  };

  updateRelation<T, R = unknown>(
    key: string | number,
    attributes: T,
    relations?: Record<string, RelationDefinition<R, unknown>>
  ): T & {
    operation: "update";
    key: string | number;
    attributes: T;
    relations?: Record<string, RelationDefinition<R, unknown>>;
    __relationDefinition?: true;
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

// Interface qui expose uniquement build() et mutate() avec relations typées
export interface BuildOnly<TModel, TRelations = {}> {
  build(): MutationRequest<TModel, TRelations>;
  mutate(options?: Partial<RequestConfig>): Promise<MutationResponse>;
}

// Interface pour les méthodes d'entité
export interface IEntityBuilder<TModel> {
  createEntity<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
    attributes: T
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