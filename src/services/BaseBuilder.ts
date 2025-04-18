import {
   AttachRelationDefinition,
   DetachRelationDefinition,
   SyncRelationDefinition,
   ToggleRelationDefinition,
   IRelationBuilder,
   ValidCreateNestedRelation,
   ValidUpdateNestedRelation,
   CreateRelationOperation,
   UpdateRelationOperation
} from "@/types/mutate";

export class BaseBuilder implements IRelationBuilder {
   public createRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
      attributes: T,
      relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>
   ): T & CreateRelationOperation<T> & {
      relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>;
   } {
      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, unknown> = {};

      // Extraire les relations des attributs
      for (const [key, value] of Object.entries(attributes)) {
         if (value && typeof value === 'object' && 'operation' in value) {
            nestedRelations[key] = value;
         } else {
            normalAttributes[key] = value;
         }
      }

      // Ajouter les relations explicites si fournies
      if (relations) {
         for (const [key, value] of Object.entries(relations)) {
            nestedRelations[key] = value;
         }
      }

      // Créer la définition de relation
      const relationDefinition = {
         operation: "create" as const,
         attributes: normalAttributes as T,
         ...(Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {})
      } as T & CreateRelationOperation<T> & {
         relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>;
      };

      // Définir __relationDefinition comme propriété non-énumérable
      Object.defineProperty(relationDefinition, '__relationDefinition', {
         value: true,
         enumerable: false
      });

      // Ajouter les getters pour les propriétés normales
      for (const key of Object.keys(normalAttributes)) {
         Object.defineProperty(relationDefinition, key, {
            get() {
               return normalAttributes[key];
            },
            enumerable: true
         });
      }

      return relationDefinition;
   }

   public updateRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
      key: string | number,
      attributes: T,
      relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>
   ): T & UpdateRelationOperation<T> & {
      operation: "update";
      relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>;
   } {
      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, unknown> = {};

      // Extraire les relations des attributs
      for (const [attrKey, value] of Object.entries(attributes)) {
         if (value && typeof value === 'object' && 'operation' in value) {
            nestedRelations[attrKey] = value;
         } else {
            normalAttributes[attrKey] = value;
         }
      }

      // Ajouter les relations explicites si fournies
      if (relations) {
         for (const [key, value] of Object.entries(relations)) {
            nestedRelations[key] = value;
         }
      }

      // Créer la définition de relation
      const relationDefinition = {
         operation: "update" as const,
         key,
         attributes: normalAttributes as T,
         ...(Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {})
      } as T & UpdateRelationOperation<T> & {
         relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>;
      };

      // Définir __relationDefinition comme propriété non-énumérable
      Object.defineProperty(relationDefinition, '__relationDefinition', {
         value: true,
         enumerable: false
      });

      // Ajouter les getters pour les propriétés normales
      for (const key of Object.keys(normalAttributes)) {
         Object.defineProperty(relationDefinition, key, {
            get() {
               return normalAttributes[key];
            },
            enumerable: true
         });
      }

      return relationDefinition;
   }

   public attach(key: string | number): AttachRelationDefinition {
      const result = {
         operation: "attach" as const,
         key
      };

      // Définir __relationDefinition comme propriété non-énumérable
      Object.defineProperty(result, '__relationDefinition', {
         value: true,
         enumerable: false,
         writable: false,
         configurable: true
      });

      return result;
   }

   public detach(key: string | number): DetachRelationDefinition {
      const result = {
         operation: "detach" as const,
         key
      };

      // Définir __relationDefinition comme propriété non-énumérable
      Object.defineProperty(result, '__relationDefinition', {
         value: true,
         enumerable: false,
         writable: false,
         configurable: true
      });

      return result;
   }

   public sync<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>,
      withoutDetaching?: boolean
   ): SyncRelationDefinition<T> {
      const result = {
         operation: "sync" as const,
         key,
         without_detaching: withoutDetaching,
         ...(attributes && { attributes }),
         ...(pivot && { pivot })
      };

      // Définir __relationDefinition comme propriété non-énumérable
      Object.defineProperty(result, '__relationDefinition', {
         value: true,
         enumerable: false
      });

      return result;
   }

   public toggle<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>
   ): ToggleRelationDefinition<T> {
      const result = {
         operation: "toggle" as const,
         key,
         ...(attributes && { attributes }),
         ...(pivot && { pivot })
      };

      // Définir __relationDefinition comme propriété non-énumérable
      Object.defineProperty(result, '__relationDefinition', {
         value: true,
         enumerable: false
      });

      return result;
   }
}