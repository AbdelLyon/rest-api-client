import {
  AttachRelationDefinition,
  Attributes,
  BuildOnly,
  CreateEntityAttributes,
  CreateRelationParams,
  CreateRelationResult,
  DetachRelationDefinition,
  IEntityBuilder,
  IRelationBuilder,
  MutationFunction,
  MutationRequest,
  MutationResponse,
  SimpleKey,
  SyncParams,
  SyncRelationDefinition,
  ToggleParams,
  ToggleRelationDefinition,
  UpdateRelationParams,
  UpdateRelationResult,
} from "../types.js";
import { RequestConfig } from "../../http/types.js";
import { RelationBuilder } from "./RelationBuilder.js";
export declare class EntityBuilder<TModel>
  extends RelationBuilder
  implements IEntityBuilder<TModel>, BuildOnly<TModel>
{
  private operations;
  private mutationFn;
  private relationBuilder;
  constructor(relationBuilder: IRelationBuilder);
  private extractOperationData;
  setMutationFunction(fn: MutationFunction): void;
  createEntity<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    attributes: CreateEntityAttributes<T, TRelationKeys>,
  ): BuildOnly<TModel, Pick<T, Extract<TRelationKeys, string>>>;
  updateEntity<T extends Record<string, unknown>>(
    key: string | number,
    attributes: T,
  ): IEntityBuilder<TModel>;
  build(): MutationRequest<TModel, any>;
  mutate(options?: Partial<RequestConfig>): Promise<MutationResponse>;
  createRelation<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKeys>,
  ): CreateRelationResult<T, TRelationKeys>;
  updateRelation<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKeys>,
  ): UpdateRelationResult<T, TRelationKeys>;
  attach(key: SimpleKey): AttachRelationDefinition;
  detach(key: SimpleKey): DetachRelationDefinition;
  sync<T>(params: SyncParams<T>): SyncRelationDefinition<T>;
  toggle<T>(params: ToggleParams<T>): ToggleRelationDefinition<T>;
}
