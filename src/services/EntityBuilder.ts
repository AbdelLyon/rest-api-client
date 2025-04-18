import { MutationResponse, RequestConfig } from "@/types";
import { BaseBuilder } from "./BaseBuilder";
import { BuildOnly, ExtractModelAttributes, IEntityBuilder, IRelationBuilder, MutationFunction, MutationRequest, NestedRelationOperation, TypedMutationOperation } from "@/types/mutate";


export class EntityBuilder<TModel> extends BaseBuilder implements IEntityBuilder<TModel>, BuildOnly<TModel> {
   private operations: Array<TypedMutationOperation<TModel, any>> = [];
   private mutationFn: MutationFunction | null = null;
   private relationBuilder: IRelationBuilder;

   constructor (relationBuilder: IRelationBuilder) {
      super();
      this.relationBuilder = relationBuilder;
   }

   public setMutationFunction(fn: MutationFunction): void {
      this.mutationFn = fn;
   }

   public createEntity<
      T extends Record<string, unknown>,
      R extends Record<string, unknown> = {}
   >(options: {
      attributes: T;
      relations?: R;
   }): BuildOnly<TModel, R> {
      const operation: TypedMutationOperation<TModel, R> = {
         operation: "create",
         attributes: options.attributes as ExtractModelAttributes<TModel>,
         relations: options.relations || {} as R
      };

      this.operations.push(operation);
      return this as unknown as BuildOnly<TModel, R>;
   }

   public updateEntity<
      T extends Record<string, unknown>,
      R extends Record<string, unknown> = {}
   >(
      key: string | number,
      options: {
         attributes?: T;
         relations?: R;
      }
   ): IEntityBuilder<TModel> {
      const operation: TypedMutationOperation<TModel, R> = {
         operation: "update",
         key,
         attributes: (options.attributes || {}) as ExtractModelAttributes<TModel>,
         relations: options.relations || {} as R
      };

      this.operations.push(operation);
      return this;
   }

   public build(): MutationRequest<TModel, any> {
      const result = [...this.operations];
      this.operations = []; // Réinitialiser le builder pour une utilisation future
      return { mutate: result };
   }

   public async mutate(options?: Partial<RequestConfig>): Promise<MutationResponse> {
      if (!this.mutationFn) {
         throw new Error("Mutation function not provided to builder");
      }

      const data = this.build();
      return this.mutationFn(data, options);
   }

   public override createRelation<T, R = unknown>(
      attributes: T,
      relations?: Record<string, NestedRelationOperation<R>>
   ) {
      return this.relationBuilder.createRelation<T, R>(attributes, relations);
   }

   public override updateRelation<T, R = unknown>(
      key: string | number,
      attributes: T,
      relations?: Record<string, NestedRelationOperation<R>>
   ) {
      return this.relationBuilder.updateRelation<T, R>(key, attributes, relations);
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
      withoutDetaching?: boolean
   ) {
      return this.relationBuilder.sync<T>(key, attributes, pivot, withoutDetaching);
   }

   public override toggle<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>
   ) {
      return this.relationBuilder.toggle<T>(key, attributes, pivot);
   }
}