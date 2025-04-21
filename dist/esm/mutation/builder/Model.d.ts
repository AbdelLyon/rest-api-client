import {
  AttachRelationDefinition,
  Attributes,
  BuilderOnly,
  CreateRelationParams,
  CreateValidRelationOperation,
  DetachRelationDefinition,
  IModel,
  IRelation,
  MutationFunction,
  MutationRequest,
  MutationResponse,
  SimpleKey,
  StrictCreateRelationsMap,
  StrictUpdateRelationsMap,
  SyncParams,
  SyncRelationDefinition,
  ToggleParams,
  ToggleRelationDefinition,
  UpdateRelationParams,
  UpdateValidRelationOperation,
} from "../types.js";
import { RequestConfig } from "../../http/types.js";
import { Relation } from "./Relation.js";
export declare class Model<TModel>
  extends Relation
  implements IModel<TModel>, BuilderOnly<TModel>
{
  private operations;
  private mutationFn;
  private relation;
  constructor(relation: IRelation);
  setMutationFunction(fn: MutationFunction<TModel>): void;
  create<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(params: {
    attributes: T;
    relations?: StrictCreateRelationsMap<
      Record<Extract<TRelationKeys, string>, unknown>
    >;
  }): BuilderOnly<TModel>;
  update<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    key: SimpleKey,
    params: {
      attributes?: T;
      relations?: StrictUpdateRelationsMap<
        Record<Extract<TRelationKeys, string>, unknown>
      >;
    },
  ): BuilderOnly<TModel>;
  build(): MutationRequest<TModel, Record<string, unknown>>;
  mutate(options?: Partial<RequestConfig>): Promise<MutationResponse>;
  add<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKeys>,
  ): CreateValidRelationOperation;
  edit<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKeys>,
  ): UpdateValidRelationOperation;
  attach(key: SimpleKey): AttachRelationDefinition;
  detach(key: SimpleKey): DetachRelationDefinition;
  sync<T>(params: SyncParams<T>): SyncRelationDefinition<T>;
  toggle<T>(params: ToggleParams<T>): ToggleRelationDefinition<T>;
}
