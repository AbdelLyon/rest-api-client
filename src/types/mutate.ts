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

export type RelationDefinition<T, InCreateContext extends boolean = false> =
  InCreateContext extends true
  ? (CreateRelationDefinitionBase<T> & {
    relations?: { [key: string]: RelationDefinition<any, true>; };
  }) | AttachRelationDefinition
  : (CreateRelationDefinitionBase<T> & {
    relations?: { [key: string]: RelationDefinition<any, false>; };
  }) | (UpdateRelationDefinitionBase<T> & {
    relations?: { [key: string]: RelationDefinition<any, false>; };
  }) | AttachRelationDefinition | DetachRelationDefinition | SyncRelationDefinition<T> | ToggleRelationDefinition<T>;

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

export type MutationOperation<
  TAttributes,
  TRelations
> = CreateMutationOperation<TAttributes, TRelations> | UpdateMutationOperation<TAttributes, TRelations>;

export interface MutationRequest<
  TAttributes,
  TRelations
> {
  mutate: Array<MutationOperation<TAttributes, TRelations>>;
};

export interface MutationResponse {
  created: Array<string | number>;
  updated: Array<string | number>;
}