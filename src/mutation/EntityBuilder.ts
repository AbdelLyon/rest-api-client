import type {
  BuildOnly,
  CreateEntityAttributes,
  ExtractModelAttributes,
  MutationFunction,
  MutationRequest,
  MutationResponse,
  TypedMutationOperation,
  ValidCreateNestedRelation,
  ValidUpdateNestedRelation,
} from "@/mutation/types/mutation";
import type { IEntityBuilder } from "@/mutation/types/IEntityBuilder";
import type { IRelationBuilder } from "@/mutation/types/IRelationBuilder";
import type { RequestConfig } from "@/http/types/http";
import { RelationBuilder } from "@/mutation/RelationBuilder";

export class EntityBuilder<TModel>
  extends RelationBuilder
  implements IEntityBuilder<TModel>, BuildOnly<TModel>
{
  private operations: Array<TypedMutationOperation<TModel, any>> = [];
  private mutationFn: MutationFunction | null = null;
  private relationBuilder: IRelationBuilder;

  constructor(relationBuilder: IRelationBuilder) {
    super();
    this.relationBuilder = relationBuilder;
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

  public createEntity<
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

  public updateEntity<T extends Record<string, unknown>>(
    key: string | number,
    attributes: T,
  ): IEntityBuilder<TModel> {
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
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    attributes: T,
    relations?: Record<TRelationKeys, ValidCreateNestedRelation<unknown>>,
  ) {
    return this.relationBuilder.createRelation<T, TRelationKeys>(
      attributes,
      relations,
    );
  }

  public override updateRelation<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    key: string | number,
    attributes: T,
    relations?: Record<TRelationKeys, ValidUpdateNestedRelation<unknown>>,
  ) {
    return this.relationBuilder.updateRelation<T, TRelationKeys>(
      key,
      attributes,
      relations,
    );
  }

  public override attach(key: string | number) {
    return this.relationBuilder.attach(key);
  }

  public override detach(key: string | number) {
    return this.relationBuilder.detach(key);
  }

  public override sync<T>(
    key: string | number | Array<string | number>,
    attributes?: T,
    pivot?: Record<string, string | number>,
    withoutDetaching?: boolean,
  ) {
    return this.relationBuilder.sync<T>(
      key,
      attributes,
      pivot,
      withoutDetaching,
    );
  }

  public override toggle<T>(
    key: string | number | Array<string | number>,
    attributes?: T,
    pivot?: Record<string, string | number>,
  ) {
    return this.relationBuilder.toggle<T>(key, attributes, pivot);
  }
}
