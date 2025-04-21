import type {
  AttachRelationDefinition,
  Attributes,
  CreateRelationParams,
  CreateRelationResult,
  DetachRelationDefinition,
  ExtractedAttributes,
  IRelation,
  RelationDefinition,
  SimpleKey,
  SyncParams,
  SyncRelationDefinition,
  ToggleParams,
  ToggleRelationDefinition,
  UpdateRelationParams,
  UpdateRelationResult,
} from "../types";

export class Relation implements IRelation {
  public add<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKeys>,
  ): CreateRelationResult<T, TRelationKeys> {
    const { attributes, relations } = params;

    const { normalAttributes, nestedRelations: extractedRelations } =
      this.extractNestedRelations(attributes);

    const allRelations = relations
      ? { ...extractedRelations, ...relations }
      : extractedRelations;

    const relationDefinition = {
      operation: "create" as const,
      attributes: normalAttributes as T,
      ...(Object.keys(allRelations).length > 0
        ? { relations: allRelations }
        : {}),
    } as CreateRelationResult<T, TRelationKeys>;

    this.defineRelationDefinition(relationDefinition);
    this.addGetters(relationDefinition, normalAttributes);

    return relationDefinition;
  }

  public edit<T extends Attributes, TRelationKeys extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKeys>,
  ): UpdateRelationResult<T, TRelationKeys> {
    const { key, attributes, relations } = params;

    const { normalAttributes, nestedRelations: extractedRelations } =
      this.extractNestedRelations(attributes);

    const allRelations = relations
      ? { ...extractedRelations, ...relations }
      : extractedRelations;

    const relationDefinition = {
      operation: "update" as const,
      key,
      attributes: normalAttributes as T,
      ...(Object.keys(allRelations).length > 0
        ? { relations: allRelations }
        : {}),
    } as UpdateRelationResult<T, TRelationKeys>;

    this.defineRelationDefinition(relationDefinition);
    this.addGetters(relationDefinition, normalAttributes);

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

  private extractNestedRelations<T extends Attributes>(
    attributes: T,
  ): ExtractedAttributes {
    const normalAttributes: Attributes = {};
    const nestedRelations: Attributes = {};

    for (const [key, value] of Object.entries(attributes)) {
      if (value && typeof value === "object" && "operation" in value) {
        nestedRelations[key] = value;
      } else {
        normalAttributes[key] = value;
      }
    }

    return { normalAttributes, nestedRelations };
  }

  private addGetters(
    relationDefinition: Record<string, unknown>,
    normalAttributes: Attributes,
  ): void {
    for (const key of Object.keys(normalAttributes)) {
      Object.defineProperty(relationDefinition, key, {
        get() {
          return normalAttributes[key];
        },
        enumerable: true,
      });
    }
  }
}
