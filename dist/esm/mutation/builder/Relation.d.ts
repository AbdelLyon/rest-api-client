import {
  AttachRelationDefinition,
  Attributes,
  CreateRelationParams,
  CreateValidRelationOperation,
  DetachRelationDefinition,
  IRelation,
  SimpleKey,
  SyncParams,
  SyncRelationDefinition,
  ToggleParams,
  ToggleRelationDefinition,
  UpdateRelationParams,
  UpdateValidRelationOperation,
} from "../types.js";
export declare class Relation implements IRelation {
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
  private createSimpleOperation;
  private defineRelationDefinition;
  private extractNestedRelations;
  private addGetters;
}
