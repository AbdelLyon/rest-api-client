import {
  AttachRelationDefinition,
  Attributes,
  DetachRelationDefinition,
  IRelation,
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
export declare class Relation implements IRelation {
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
  private createSimpleOperation;
  private defineRelationDefinition;
  private extractNestedRelations;
  private addGetters;
}
