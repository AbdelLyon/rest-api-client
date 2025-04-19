import {
  AttachRelationDefinition,
  CreateRelationOperation,
  DetachRelationDefinition,
  SyncRelationDefinition,
  ToggleRelationDefinition,
  UpdateRelationOperation,
  ValidCreateNestedRelation,
  ValidUpdateNestedRelation,
} from "./mutation.js";
export interface IRelationBuilder {
  createRelation: <
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    attributes: T,
    relations?: Record<TRelationKeys, ValidCreateNestedRelation<unknown>>,
  ) => T &
    CreateRelationOperation<T> & {
      relations?: Record<TRelationKeys, ValidCreateNestedRelation<unknown>>;
    };
  updateRelation: <
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    key: string | number,
    attributes: T,
    relations?: Record<TRelationKeys, ValidUpdateNestedRelation<unknown>>,
  ) => T &
    UpdateRelationOperation<T> & {
      relations?: Record<TRelationKeys, ValidUpdateNestedRelation<unknown>>;
    };
  attach: (key: string | number) => AttachRelationDefinition;
  detach: (key: string | number) => DetachRelationDefinition;
  sync: <T>(
    key: string | number | Array<string | number>,
    attributes?: T,
    pivot?: Record<string, string | number>,
    withoutDetaching?: boolean,
  ) => SyncRelationDefinition<T>;
  toggle: <T>(
    key: string | number | Array<string | number>,
    attributes?: T,
    pivot?: Record<string, string | number>,
  ) => ToggleRelationDefinition<T>;
}
