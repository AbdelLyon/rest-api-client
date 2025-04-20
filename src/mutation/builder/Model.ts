import type {
  AttachRelationDefinition,
  Attributes,
  BuildOnly,
  CreateEntityAttributes,
  CreateRelationParams,
  CreateRelationResult,
  DetachRelationDefinition,
  ExtractModelAttributes,
  IModel,
  IRelation,
  MutationFunction,
  MutationRequest,
  MutationResponse,
  SimpleKey,
  SyncParams,
  SyncRelationDefinition,
  ToggleParams,
  ToggleRelationDefinition,
  TypedMutationOperation,
  UpdateRelationParams,
  UpdateRelationResult,
} from "@/mutation/types";
import type { RequestConfig } from "@/http/types";
import { Relation } from "@/mutation/builder/Relation";

export class Model<TModel>
  extends Relation
  implements IModel<TModel>, BuildOnly<TModel>
{
  private operations: Array<TypedMutationOperation<TModel, any>> = [];
  private mutationFn: MutationFunction | null = null;
  private relation: IRelation;

  constructor(relation: IRelation) {
    super();
    this.relation = relation;
  }

  private extractOperationData<T extends Record<string, unknown>>(
    attributes: T,
  ): {
    normalAttributes: Record<string, unknown>;
    relations: Record<string, unknown>;
  } {
    const normalAttributes: Record<string, unknown> = {};
    const relations: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(attributes)) {
      if (value && typeof value === "object" && "operation" in value) {
        relations[key] = value;
      } else {
        normalAttributes[key] = value;
      }
    }

    return { normalAttributes, relations };
  }

  public setMutationFunction(fn: MutationFunction): void {
    this.mutationFn = fn;
  }

  public createModel<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    attributes: CreateEntityAttributes<T, TRelationKeys>,
  ): BuildOnly<TModel, Pick<T, Extract<TRelationKeys, string>>> {
    const { normalAttributes, relations } =
      this.extractOperationData(attributes);

    const operation: TypedMutationOperation<TModel, typeof relations> = {
      operation: "create",
      attributes: normalAttributes as ExtractModelAttributes<TModel>,
      relations,
    };

    this.operations.push(operation);
    return this as unknown as BuildOnly<
      TModel,
      Pick<T, Extract<TRelationKeys, string>>
    >;
  }

  public updateModel<T extends Record<string, unknown>>(
    key: string | number,
    attributes: T,
  ): IModel<TModel> {
    const { normalAttributes, relations } =
      this.extractOperationData(attributes);

    const operation: TypedMutationOperation<TModel, typeof relations> = {
      operation: "update",
      key,
      attributes: normalAttributes as ExtractModelAttributes<TModel>,
      relations,
    };

    this.operations.push(operation);
    return this;
  }

  public build(): MutationRequest<TModel, any> {
    const result = [...this.operations];
    this.operations = [];
    return { mutate: result };
  }

  public async mutate(
    options?: Partial<RequestConfig>,
  ): Promise<MutationResponse> {
    if (!this.mutationFn) {
      throw new Error("Mutation function not provided to builder");
    }

    const data = this.build();
    return this.mutationFn(data, options);
  }

  public override createRelation<
    T extends Attributes,
    TRelationKeys extends keyof T = never,
  >(
    params: CreateRelationParams<T, TRelationKeys>,
  ): CreateRelationResult<T, TRelationKeys> {
    const { attributes, relations } = params;
    return this.relation.createRelation<T, TRelationKeys>({
      attributes,
      relations,
    });
  }

  public override updateRelation<
    T extends Attributes,
    TRelationKeys extends keyof T = never,
  >(
    params: UpdateRelationParams<T, TRelationKeys>,
  ): UpdateRelationResult<T, TRelationKeys> {
    const { key, attributes, relations } = params;
    return this.relation.updateRelation<T, TRelationKeys>({
      key,
      attributes,
      relations,
    });
  }

  public override attach(key: SimpleKey): AttachRelationDefinition {
    return this.relation.attach(key);
  }

  public override detach(key: SimpleKey): DetachRelationDefinition {
    return this.relation.detach(key);
  }

  public override sync<T>(params: SyncParams<T>): SyncRelationDefinition<T> {
    const { key, attributes, pivot, withoutDetaching } = params;
    return this.relation.sync<T>({
      key,
      attributes,
      pivot,
      withoutDetaching,
    });
  }

  public override toggle<T>(
    params: ToggleParams<T>,
  ): ToggleRelationDefinition<T> {
    const { key, attributes, pivot } = params;
    return this.relation.toggle<T>({
      key,
      attributes,
      pivot,
    });
  }
}
