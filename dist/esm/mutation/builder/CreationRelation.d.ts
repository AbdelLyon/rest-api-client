import {
  Attributes,
  AttachRelationDefinition,
  CreateRelationOperation,
  CreateRelationParams,
  ICreationRelation,
  SimpleKey,
} from "../types.js";
export declare class CreationRelation implements ICreationRelation {
  add<T extends Attributes, TRelationKey extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKey>,
  ): CreateRelationOperation<T>;
  attach(key: SimpleKey): AttachRelationDefinition;
  private defineRelationDefinition;
}
