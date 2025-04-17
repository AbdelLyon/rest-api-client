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

   public static createBuilder<T>(): Builder<T> {
      if (!Builder.instance) {
         Builder.instance = new Builder<T>();
      }
      return Builder.instance as Builder<T>;
   }

   public createEntity<T extends Record<string, any>>(
      attributes: T
   ): this {
      // Séparer les attributs normaux des attributs de relation
      const normalAttributes: Record<string, any> = {};
      const relations: Record<string, RelationDefinition> = {};

      // Parcourir tous les attributs pour identifier les relations
      for (const [key, value] of Object.entries(attributes)) {
         // Vérifier si l'attribut est une relation (a une propriété 'operation')
         if (value && typeof value === 'object' && 'operation' in value) {
            relations[key] = value as RelationDefinition;
         } else {
            normalAttributes[key] = value;
         }
      }

      const operation: MutationOperation<ExtractModelAttributes<TModel>> = {
         operation: "create",
         attributes: normalAttributes as ExtractModelAttributes<TModel>,
         ...(Object.keys(relations).length > 0 && { relations })
      };

      this.mutate.push(operation);
      return this;
   }

   public updateEntity<T extends Record<string, any>>(
      key: string | number,
      attributes: T
   ): this {
      // Même logique que createEntity pour séparer les attributs normaux des relations
      const normalAttributes: Record<string, any> = {};
      const relations: Record<string, RelationDefinition> = {};

      for (const [attrKey, value] of Object.entries(attributes)) {
         if (value && typeof value === 'object' && 'operation' in value) {
            relations[attrKey] = value as RelationDefinition;
         } else {
            normalAttributes[attrKey] = value;
         }
      }

      const operation: MutationOperation<ExtractModelAttributes<TModel>> = {
         operation: "update",
         key,
         attributes: normalAttributes as ExtractModelAttributes<TModel>,
         ...(Object.keys(relations).length > 0 && { relations })
      };

      this.mutate.push(operation);
      return this;
   }

   public createRelation<T>(
      attributes: T
   ): CreateRelationDefinitionBase<T> {
      // Séparer les attributs normaux des attributs de relation pour les relations imbriquées
      const normalAttributes: Record<string, any> = {};
      const nestedRelations: Record<string, RelationDefinition> = {};

      if (attributes && typeof attributes === 'object') {
         for (const [key, value] of Object.entries(attributes as Record<string, any>)) {
            if (value && typeof value === 'object' && 'operation' in value) {
               nestedRelations[key] = value as RelationDefinition;
            } else {
               normalAttributes[key] = value;
            }
         }
      }

      return {
         operation: "create",
         attributes: normalAttributes as T,
         ...(Object.keys(nestedRelations).length > 0 && { relations: nestedRelations })
      };
   }

   public updateRelation<T>(
      key: string | number,
      attributes: T
   ): UpdateRelationDefinitionBase<T> {
      // Même logique pour les relations imbriquées
      const normalAttributes: Record<string, any> = {};
      const nestedRelations: Record<string, RelationDefinition> = {};

      if (attributes && typeof attributes === 'object') {
         for (const [attrKey, value] of Object.entries(attributes as Record<string, any>)) {
            if (value && typeof value === 'object' && 'operation' in value) {
               nestedRelations[attrKey] = value as RelationDefinition;
            } else {
               normalAttributes[attrKey] = value;
            }
         }
      }

      return {
         operation: "update",
         key,
         attributes: normalAttributes as T,
         ...(Object.keys(nestedRelations).length > 0 && { relations: nestedRelations })
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