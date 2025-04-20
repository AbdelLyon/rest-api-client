import {
  AttachRelationDefinition,
  Attributes,
  CreateRelationParams,
  CreateRelationResult,
  DetachRelationDefinition,
  IRelationBuilder,
  SimpleKey,
  SyncParams,
  SyncRelationDefinition,
  ToggleParams,
  ToggleRelationDefinition,
  UpdateRelationParams,
  UpdateRelationResult,
} from "../types.js";
export declare class RelationBuilder implements IRelationBuilder {
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
  private createSimpleOperation;
  private defineRelationDefinition;
  private extractNestedRelations;
  private addGetters;
}
