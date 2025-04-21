import {
  AttachRelationDefinition,
  Attributes,
  BuilderOnly,
  CreateEntityAttributes,
  CreateRelationParams,
  CreateRelationResult,
  DetachRelationDefinition,
  IModel,
  IRelation,
  MutationFunction,
  MutationRequest,
  MutationResponse,
  SimpleKey,
  SyncParams,
  SyncRelationDefinition,
  ToggleParams,
  ToggleRelationDefinition,
  UpdateEntityAttributes,
  UpdateRelationParams,
  UpdateRelationResult,
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
  private extractOperationData;
  setMutationFunction(fn: MutationFunction<TModel>): void;
  create<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(attributes: CreateEntityAttributes<T, TRelationKeys>): BuilderOnly<TModel>;
  update<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    key: string | number,
    attributes: UpdateEntityAttributes<T, TRelationKeys>,
  ): BuilderOnly<TModel>;
  build(): MutationRequest<TModel, Record<string, unknown>>;
  mutate(options?: Partial<RequestConfig>): Promise<MutationResponse>;
  add<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKeys>,
  ): CreateRelationResult<T, TRelationKeys>;
  edit<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKeys>,
  ): UpdateRelationResult<T, TRelationKeys>;
  attach(key: SimpleKey): AttachRelationDefinition;
  detach(key: SimpleKey): DetachRelationDefinition;
  sync<T>(params: SyncParams<T>): SyncRelationDefinition<T>;
  toggle<T>(params: ToggleParams<T>): ToggleRelationDefinition<T>;
}
