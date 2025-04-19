import type {
  AttachRelationDefinition,
  CreateRelationOperation,
  DetachRelationDefinition,
  SyncRelationDefinition,
  ToggleRelationDefinition,
  UpdateRelationOperation,
  ValidCreateNestedRelation,
  ValidUpdateNestedRelation,
} from "@/mutation/types/mutation";
import type { IRelationBuilder } from "@/mutation/types/IRelationBuilder";

export class RelationBuilder implements IRelationBuilder {
  private defineRelationDefinition(result: Record<string, unknown>): void {
    Object.defineProperty(result, "__relationDefinition", {
      value: true,
      enumerable: false,
      writable: false,
      configurable: true,
    });
  }

  private extractNestedRelations<T extends Record<string, unknown>>(
    attributes: T,
  ): {
    normalAttributes: Record<string, unknown>;
    nestedRelations: Record<string, unknown>;
  } {
    const normalAttributes: Record<string, unknown> = {};
    const nestedRelations: Record<string, unknown> = {};

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
    normalAttributes: Record<string, unknown>,
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

  public createRelation<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    attributes: T,
    relations?: Record<TRelationKeys, ValidCreateNestedRelation<unknown>>,
  ): T &
    CreateRelationOperation<T> & {
      relations?: Record<TRelationKeys, ValidCreateNestedRelation<unknown>>;
    } {
    const { normalAttributes, nestedRelations: initialNestedRelations } =
      this.extractNestedRelations(attributes);
    const nestedRelations = relations
      ? { ...initialNestedRelations, ...relations }
      : initialNestedRelations;

    const relationDefinition = {
      operation: "create" as const,
      attributes: normalAttributes as T,
      ...(Object.keys(nestedRelations).length > 0
        ? { relations: nestedRelations }
        : {}),
    } as T &
      CreateRelationOperation<T> & {
        relations?: Record<TRelationKeys, ValidCreateNestedRelation<unknown>>;
      };

    this.defineRelationDefinition(relationDefinition);
    this.addGetters(relationDefinition, normalAttributes);

    return relationDefinition;
  }

  public updateRelation<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    key: string | number,
    attributes: T,
    relations?: Record<TRelationKeys, ValidUpdateNestedRelation<unknown>>,
  ): T &
    UpdateRelationOperation<T> & {
      operation: "update";
      relations?: Record<TRelationKeys, ValidUpdateNestedRelation<unknown>>;
    } {
    const { normalAttributes, nestedRelations: initialNestedRelations } =
      this.extractNestedRelations(attributes);
    const nestedRelations = relations
      ? { ...initialNestedRelations, ...relations }
      : initialNestedRelations;

    const relationDefinition = {
      operation: "update" as const,
      key,
      attributes: normalAttributes as T,
      ...(Object.keys(nestedRelations).length > 0
        ? { relations: nestedRelations }
        : {}),
    } as T &
      UpdateRelationOperation<T> & {
        relations?: Record<TRelationKeys, ValidUpdateNestedRelation<unknown>>;
      };

    this.defineRelationDefinition(relationDefinition);
    this.addGetters(relationDefinition, normalAttributes);

    return relationDefinition;
  }

  public attach(key: string | number): AttachRelationDefinition {
    const result = {
      operation: "attach" as const,
      key,
    };

    this.defineRelationDefinition(result);
    return result;
  }

  public detach(key: string | number): DetachRelationDefinition {
    const result = {
      operation: "detach" as const,
      key,
    };

    this.defineRelationDefinition(result);
    return result;
  }

  public sync<T>(
    key: string | number | Array<string | number>,
    attributes?: T,
    pivot?: Record<string, string | number>,
    withoutDetaching?: boolean,
  ): SyncRelationDefinition<T> {
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

  public toggle<T>(
    key: string | number | Array<string | number>,
    attributes?: T,
    pivot?: Record<string, string | number>,
  ): ToggleRelationDefinition<T> {
    const result = {
      operation: "toggle" as const,
      key,
      ...(attributes && { attributes }),
      ...(pivot && { pivot }),
    };

    this.defineRelationDefinition(result);
    return result;
  }
}
