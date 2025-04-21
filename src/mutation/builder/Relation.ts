import type {
  Attributes,
  AttachRelationDefinition,
  BaseRelationDefinition,
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
  CreateValidRelationOperation,
} from "../types";

export class Relation implements IRelation {
  private context: "create" | "update" = "update"; // Par défaut en mode mise à jour

  // Définir le contexte
  public setContext(context: "create" | "update"): void {
    this.context = context;
  }

  // Méthodes toujours disponibles
  public add<T extends Attributes, TRelationKey extends keyof T = never>(
    params: CreateRelationParams<T, TRelationKey>,
  ): CreateRelationOperation<T> {
    const { attributes, relations = {} } = params;

    const relationDefinition: CreateRelationOperation<T> = {
      operation: "create",
      attributes,
      relations: relations as
        | Record<string, CreateValidRelationOperation>
        | undefined,
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

  // Méthodes disponibles uniquement en contexte de mise à jour
  public edit<T extends Attributes, TRelationKey extends keyof T = never>(
    params: UpdateRelationParams<T, TRelationKey>,
  ): UpdateRelationOperation<T> {
    this.checkUpdateContext("edit");

    const { key, attributes, relations = {} } = params;

    const relationDefinition: UpdateRelationOperation<T> = {
      operation: "update",
      key,
      attributes,
      relations: relations as
        | Record<string, UpdateRelationOperation<T>>
        | undefined,
    };

    this.defineRelationDefinition(relationDefinition);
    return relationDefinition;
  }

  public detach(key: SimpleKey): DetachRelationDefinition {
    this.checkUpdateContext("detach");

    const result: DetachRelationDefinition = {
      operation: "detach",
      key,
    };

    this.defineRelationDefinition(result);
    return result;
  }

  public sync<T>(params: SyncParams<T>): SyncRelationDefinition<T> {
    this.checkUpdateContext("sync");

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
    this.checkUpdateContext("toggle");

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

  // Méthode privée pour vérifier le contexte
  private checkUpdateContext(methodName: string): void {
    if (this.context === "create") {
      throw new Error(
        `Cannot use method '${methodName}' in creation context. Only 'add' and 'attach' methods are allowed.`,
      );
    }
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
