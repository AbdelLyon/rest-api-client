import {
  AttachRelationDefinition,
  Attributes,
  BuildOnly,
  CreateEntityAttributes,
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
  addRelationParams,
  addRelationResult,
  editRelationParams,
  editRelationResult,
} from "../types.js";
import { RequestConfig } from "../../http/types.js";
import { Relation } from "./Relation.js";
export declare class Model<TModel>
  extends Relation
  implements IModel<TModel>, BuildOnly<TModel>
{
  private operations;
  private mutationFn;
  private relation;
  constructor(relation: IRelation);
  private extractOperationData;
  setMutationFunction(fn: MutationFunction): void;
  create<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    attributes: CreateEntityAttributes<T, TRelationKeys>,
  ): BuildOnly<TModel, Pick<T, Extract<TRelationKeys, string>>>;
  update<T extends Record<string, unknown>>(
    key: string | number,
    attributes: T,
  ): IModel<TModel>;
  build(): MutationRequest<TModel, any>;
  mutate(options?: Partial<RequestConfig>): Promise<MutationResponse>;
  add<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: addRelationParams<T, TRelationKeys>,
  ): addRelationResult<T, TRelationKeys>;
  edit<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: editRelationParams<T, TRelationKeys>,
  ): editRelationResult<T, TRelationKeys>;
  attach(key: SimpleKey): AttachRelationDefinition;
  detach(key: SimpleKey): DetachRelationDefinition;
  sync<T>(params: SyncParams<T>): SyncRelationDefinition<T>;
  toggle<T>(params: ToggleParams<T>): ToggleRelationDefinition<T>;
}
