import {
  Attributes,
  AttachRelationDefinition,
  CreateRelationOperation,
  CreateRelationParams,
  DetachRelationDefinition,
  IRelation,
  SimpleKey,
  SyncParams,
  SyncRelationDefinition,
  ToggleParams,
  ToggleRelationDefinition,
  UpdateRelationOperation,
  UpdateRelationParams,
} from "../types.js";
export declare class Relation implements IRelation {
  private context;
  setContext(context: "create" | "update"): void;
  add<T extends Attributes, TRelationKey extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKey>,
  ): CreateRelationOperation<T>;
  attach(key: SimpleKey): AttachRelationDefinition;
  edit<T extends Attributes, TRelationKey extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKey>,
  ): UpdateRelationOperation<T>;
  detach(key: SimpleKey): DetachRelationDefinition;
  sync<T>(params: SyncParams<T>): SyncRelationDefinition<T>;
  toggle<T>(params: ToggleParams<T>): ToggleRelationDefinition<T>;
  private checkUpdateContext;
  private defineRelationDefinition;
}
