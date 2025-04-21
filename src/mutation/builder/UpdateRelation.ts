import type {
  Attributes,
  AttachRelationDefinition,
  CreateRelationOperation,
  CreateRelationParams,
  DetachRelationDefinition,
  IUpdateRelation,
  SimpleKey,
  SyncParams,
  SyncRelationDefinition,
  ToggleParams,
  ToggleRelationDefinition,
  UpdateRelationOperation,
  UpdateRelationParams,
  BaseRelationDefinition,
} from "../types";

export class UpdateRelation implements IUpdateRelation {
  public add<T extends Attributes, TRelationKey extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKey>,
  ): CreateRelationOperation<T> {
    const { attributes, relations } = params;

    const relationDefinition: CreateRelationOperation<T> = {
      operation: "create",
      attributes,
      ...(relations && { relations }),
    };

    this.defineRelationDefinition(relationDefinition);
    return relationDefinition;
  }

  public edit<T extends Attributes, TRelationKey extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKey>,
  ): UpdateRelationOperation<T> {
    const { key, attributes, relations } = params;

    const relationDefinition: UpdateRelationOperation<T> = {
      operation: "update",
      key,
      attributes,
      ...(relations && { relations }),
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

  public detach(key: SimpleKey): DetachRelationDefinition {
    const result: DetachRelationDefinition = {
      operation: "detach",
      key,
    };

    this.defineRelationDefinition(result);
    return result;
  }

  public sync<T>(params: SyncParams<T>): SyncRelationDefinition<T> {
    const { key, attributes, pivot, withoutDetaching } = params;

    const result: SyncRelationDefinition<T> = {
      operation: "sync",
      key,
      without_detaching: withoutDetaching,
      ...(attributes && { attributes }),
      ...(pivot && { pivot }),
    };

    this.defineRelationDefinition(result);
    return result;
  }

  public toggle<T>(params: ToggleParams<T>): ToggleRelationDefinition<T> {
    const { key, attributes, pivot } = params;

    const result: ToggleRelationDefinition<T> = {
      operation: "toggle",
      key,
      ...(attributes && { attributes }),
      ...(pivot && { pivot }),
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
