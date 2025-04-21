import type {
  Attributes,
  AttachRelationDefinition,
  BaseRelationDefinition,
  CreateRelationOperation,
  CreateRelationParams,
  CreateValidRelationOperation,
  ICreationRelation,
  SimpleKey,
} from "../types";

export class CreationRelation implements ICreationRelation {
  public add<T extends Attributes, TRelationKey extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKey>,
  ): CreateRelationOperation<T> {
    const { attributes, relations = {} } = params;

    const relationDefinition: CreateRelationOperation<T> = {
      operation: "create",
      attributes,
      relations: relations as Record<string, CreateValidRelationOperation>,
    };

    this.defineRelationDefinition(relationDefinition);
    return relationDefinition;
  }

  public attach(key: SimpleKey): AttachRelationDefinition {
    const result: AttachRelationDefinition = {
      operation: "attach",
      key,
    };

    this.defineRelationDefinition(result);
    return result;
  }

  private defineRelationDefinition(result: BaseRelationDefinition): void {
    Object.defineProperty(result, "__relationDefinition", {
      value: true,
      enumerable: false,
      writable: false,
      configurable: true,
    });
  }
}
