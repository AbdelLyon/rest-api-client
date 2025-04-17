import { } from "@/types";
import { AttachRelationDefinition, CreateRelationDefinitionBase, DetachRelationDefinition, UpdateRelationDefinitionBase, SyncRelationDefinition, ToggleRelationDefinition, MutationOperation } from "@/types/mutate";

type ExtractModelAttributes<T> = Omit<T, 'relations'>;

// Type qui regroupe tous les types de relations possibles
type RelationDefinition<T = unknown> =
   | CreateRelationDefinitionBase<T>
   | UpdateRelationDefinitionBase<T>
   | AttachRelationDefinition
   | DetachRelationDefinition
   | SyncRelationDefinition<T>
   | ToggleRelationDefinition<T>;

export class Builder<TModel> {
   private static instance: Builder<unknown>;
   private mutate: Array<MutationOperation<ExtractModelAttributes<TModel>>> = [];
   private hasCreatedEntity = false; // Flag pour suivre si createEntity a été appelé

   public static createBuilder<T>(): Builder<T> {
      if (!Builder.instance) {
         Builder.instance = new Builder<T>();
      }
      return Builder.instance as Builder<T>;
   }

   public createEntity(
      attributes: ExtractModelAttributes<TModel>,
      relations?: Record<string, RelationDefinition>
   ): this {
      const operation: MutationOperation<ExtractModelAttributes<TModel>> = {
         operation: "create",
         attributes,
         ...(relations && { relations })
      };

      this.mutate.push(operation);
      this.hasCreatedEntity = true; // Marquer qu'une entité a été créée
      return this;
   }

   public updateEntity(
      key: string | number,
      attributes: Partial<ExtractModelAttributes<TModel>>,
      relations?: Record<string, RelationDefinition>
   ): this {
      const operation: MutationOperation<ExtractModelAttributes<TModel>> = {
         operation: "update",
         key,
         attributes: attributes as ExtractModelAttributes<TModel>,
         ...(relations && { relations })
      };

      this.mutate.push(operation);
      return this;
   }

   public createRelation<T>(
      attributes: T,
      nestedRelations?: Record<string, RelationDefinition>
   ): CreateRelationDefinitionBase<T> & {
      relations?: typeof nestedRelations;
   } {
      return {
         operation: "create",
         attributes,
         ...(nestedRelations && { relations: nestedRelations })
      };
   }

   public updateRelation<T>(
      key: string | number,
      attributes: T,
      nestedRelations?: Record<string, RelationDefinition>
   ): UpdateRelationDefinitionBase<T> & {
      relations?: typeof nestedRelations;
   } {
      // Empêcher la mise à jour d'une relation si une entité a été créée
      if (this.hasCreatedEntity) {
         throw new Error("Impossible de mettre à jour une relation après la création d'une entité");
      }

      return {
         operation: "update",
         key,
         attributes,
         ...(nestedRelations && { relations: nestedRelations })
      };
   }

   public attach(key: string | number): AttachRelationDefinition {
      return {
         operation: "attach",
         key
      };
   }

   public detach(key: string | number): DetachRelationDefinition {
      return {
         operation: "detach",
         key
      };
   }

   public sync<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>,
      withoutDetaching?: boolean
   ): SyncRelationDefinition<T> {
      return {
         operation: "sync",
         key,
         without_detaching: withoutDetaching,
         ...(attributes && { attributes }),
         ...(pivot && { pivot })
      };
   }

   public toggle<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>
   ): ToggleRelationDefinition<T> {
      return {
         operation: "toggle",
         key,
         ...(attributes && { attributes }),
         ...(pivot && { pivot })
      };
   }

   public build(): Array<MutationOperation<ExtractModelAttributes<TModel>>> {
      return this.mutate;
   }
}