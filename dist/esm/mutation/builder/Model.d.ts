import {
  BuilderWithCreationContext,
  BuilderWithUpdateContext,
  IModel,
  MutationFunction,
  SimpleKey,
  StrictCreateRelationsMap,
  StrictUpdateRelationsMap,
} from "../types.js";
export declare class Model<TModel> implements IModel<TModel> {
  private operations;
  private mutationFn;
  setMutationFunction(fn: MutationFunction<TModel>): void;
  create<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(params: {
    attributes: T;
    relations?: StrictCreateRelationsMap<
      Record<Extract<TRelationKeys, string>, unknown>
    >;
  }): BuilderWithCreationContext<TModel>;
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
  ): BuilderWithUpdateContext<TModel>;
  private build;
  private mutate;
}
