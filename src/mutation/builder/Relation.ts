import type {
  AttachRelationDefinition,
  Attributes,
  CreateRelationParams,
  CreateValidRelationOperation,
  DetachRelationDefinition,
  IRelation,
  RelationDefinition,
  SimpleKey,
  SyncParams,
  SyncRelationDefinition,
  ToggleParams,
  ToggleRelationDefinition,
  UpdateRelationParams,
  UpdateValidRelationOperation,
} from "../types";

export class Relation implements IRelation {
  public add<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKeys>,
  ): CreateValidRelationOperation {
    const { attributes, relations } = params;

    const relationDefinition = {
      operation: "create" as const,
      attributes,
      relations,
    } as CreateValidRelationOperation;

    this.defineRelationDefinition(relationDefinition);
    // this.addGetters(relationDefinition, attributes);

    return relationDefinition;
  }

  public edit<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKeys>,
  ): UpdateValidRelationOperation {
    const { key, attributes, relations } = params;

    const relationDefinition = {
      operation: "update" as const,
      key,
      attributes,
      relations,
    } as UpdateValidRelationOperation;

    this.defineRelationDefinition(relationDefinition);
    // this.addGetters(relationDefinition, attributes);

    return relationDefinition;
  }

  public attach(key: SimpleKey): AttachRelationDefinition {
    return this.createSimpleOperation("attach", key);
  }

  public detach(key: SimpleKey): DetachRelationDefinition {
    return this.createSimpleOperation("detach", key);
  }

  public sync<T>(params: SyncParams<T>): SyncRelationDefinition<T> {
    const { key, attributes, pivot, withoutDetaching } = params;

    const result = {
      operation: "sync" as const,
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

    const result = {
      operation: "toggle" as const,
      key,
      ...(attributes && { attributes }),
      ...(pivot && { pivot }),
    };

    this.defineRelationDefinition(result);
    return result;
  }

  // Méthodes privées
  private createSimpleOperation<T extends "attach" | "detach">(
    operation: T,
    key: SimpleKey,
  ): T extends "attach" ? AttachRelationDefinition : DetachRelationDefinition {
    const result = {
      operation,
      key,
    } as T extends "attach"
      ? AttachRelationDefinition
      : DetachRelationDefinition;

    this.defineRelationDefinition(result);
    return result;
  }

  private defineRelationDefinition(result: RelationDefinition): void {
    Object.defineProperty(result, "__relationDefinition", {
      value: true,
      enumerable: false,
      writable: false,
      configurable: true,
    });
  }

  // private addGetters(
  //   relationDefinition:
  //     | CreateValidRelationOperation
  //     | UpdateValidRelationOperation,
  //   normalAttributes: Attributes,
  // ): void {
  //   for (const key of Object.keys(normalAttributes)) {
  //     Object.defineProperty(relationDefinition, key, {
  //       get() {
  //         return normalAttributes[key];
  //       },
  //       enumerable: true,
  //     });
  //   }
  // }
}
