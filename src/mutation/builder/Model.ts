import type {
  BuilderWithCreationContext,
  BuilderWithUpdateContext,
  ExtractModelAttributes,
  IModel,
  MutationFunction,
  MutationRequest,
  MutationResponse,
  SimpleKey,
  StrictCreateRelationsMap,
  StrictUpdateRelationsMap,
  TypedMutationOperation,
} from "../types";
import type { RequestConfig } from "@/http/types";
import { CreationRelation } from "./CreationRelation";
import { UpdateRelation } from "./UpdateRelation";

export class Model<TModel> implements IModel<TModel> {
  private operations: Array<
    TypedMutationOperation<TModel, Record<string, unknown>>
  > = [];
  private mutationFn: MutationFunction<TModel> | null = null;

  public setMutationFunction(fn: MutationFunction<TModel>): void {
    this.mutationFn = fn;
  }

  public create<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(params: {
    attributes: T;
    relations?: StrictCreateRelationsMap<
      Record<Extract<TRelationKeys, string>, unknown>
    >;
  }): BuilderWithCreationContext<TModel> {
    const { attributes, relations = {} } = params;

    const operation: TypedMutationOperation<TModel, Record<string, unknown>> = {
      operation: "create",
      attributes: attributes as ExtractModelAttributes<TModel>,
      relations: relations as Record<string, unknown>,
    };

    this.operations.push(operation);

    // Retourne un builder avec un contexte de création
    return {
      build: this.build.bind(this),
      mutate: this.mutate.bind(this),
      relation: new CreationRelation(), // Contexte de création uniquement
    };
  }

  public update<
    T extends Record<string, unknown>,
    TRelationKeys extends keyof T = never,
  >(
    key: SimpleKey,
    params: {
      attributes?: T;
      relations?: StrictUpdateRelationsMap<
        Record<Extract<TRelationKeys, string>, unknown>
      >;
    },
  ): BuilderWithUpdateContext<TModel> {
    const { attributes = {} as T, relations = {} } = params;

    const operation: TypedMutationOperation<TModel, Record<string, unknown>> = {
      operation: "update",
      key,
      attributes: attributes as ExtractModelAttributes<TModel>,
      relations: relations as Record<string, unknown>,
    };

    this.operations.push(operation);

    // Retourne un builder avec un contexte de mise à jour
    return {
      build: this.build.bind(this),
      mutate: this.mutate.bind(this),
      relation: new UpdateRelation(), // Contexte de mise à jour complet
    };
  }

  private build(): MutationRequest<TModel, Record<string, unknown>> {
    const result = [...this.operations];
    this.operations = [];
    return { mutate: result };
  }

  private async mutate(
    options?: Partial<RequestConfig>,
  ): Promise<MutationResponse> {
    if (!this.mutationFn) {
      throw new Error("Mutation function not provided to builder");
    }

    const data = this.build();
    return this.mutationFn(data, options);
  }
}
