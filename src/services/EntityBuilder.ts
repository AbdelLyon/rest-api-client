import { MutationResponse, RequestConfig } from "@/types";
import { BaseBuilder } from "./BaseBuilder";
import {
   BuildOnly,
   ExtractModelAttributes,
   IEntityBuilder,
   IRelationBuilder,
   MutationFunction,
   MutationRequest,
   TypedMutationOperation,
   ValidCreateNestedRelation,
   ValidUpdateNestedRelation,
} from "@/types/mutate";

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
      TAttributes extends Record<string, unknown>,
      TRelations extends Record<string, any> = {}
   >(
      options: {
         attributes: TAttributes;
         relations?: {
            [K in keyof TRelations]:
            | ReturnType<IRelationBuilder['createRelation']>
            | ReturnType<IRelationBuilder['attach']>;
         };
      }
   ): BuildOnly<TModel, TRelations> {
      const normalAttributes: Record<string, unknown> = { ...options.attributes };
      const relations: Record<string, unknown> = {};

      // Traiter les relations explicites si fournies
      if (options.relations) {
         for (const [key, value] of Object.entries(options.relations)) {
            relations[key] = value;
         }
      }

      const operation: TypedMutationOperation<TModel, typeof relations> = {
         operation: "create",
         attributes: normalAttributes as ExtractModelAttributes<TModel>,
         relations
      };

      this.operations.push(operation);
      return this as unknown as BuildOnly<TModel, TRelations>;
   }

   public updateEntity<T extends Record<string, unknown>>(
      key: string | number,
      attributes: T
   ): IEntityBuilder<TModel> {
      const normalAttributes: Record<string, unknown> = {};
      const relations: Record<string, unknown> = {};

      for (const [attrKey, value] of Object.entries(attributes)) {
         if (value && typeof value === 'object' && 'operation' in value) {
            relations[attrKey] = value;
         } else {
            normalAttributes[attrKey] = value;
         }
      }

      const operation: TypedMutationOperation<TModel, typeof relations> = {
         operation: "update",
         key,
         attributes: normalAttributes as ExtractModelAttributes<TModel>,
         relations
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

   // Méthodes de relation avec signatures mises à jour
   public override createRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
      attributes: T,
      relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>
   ) {
      return this.relationBuilder.createRelation<T, RelationKeys>(attributes, relations);
   }

   public override updateRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
      key: string | number,
      attributes: T,
      relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>
   ) {
      return this.relationBuilder.updateRelation<T, RelationKeys>(key, attributes, relations);
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