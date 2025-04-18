
import {
   SyncRelationDefinition,
   ToggleRelationDefinition,
   IRelationBuilder,
   DetachRelationOperation,
   AttachRelationOperation,
   NestedRelationOperation,
   CreateRelationOperation,
   UpdateRelationOperation
} from "@/types/mutate";


export class BaseBuilder implements IRelationBuilder {

   public createRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
      attributes: T,
      relations?: Record<RelationKeys, NestedRelationOperation<unknown>>
   ): T & CreateRelationOperation<T> & {
      relations?: Record<RelationKeys, NestedRelationOperation<unknown>>;
   } {
      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, unknown> = {};

      // Extraire les relations des attributs - style plus simple comme dans createEntity
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
         relations?: Record<RelationKeys, NestedRelationOperation<unknown>>;
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
      relations?: Record<RelationKeys, NestedRelationOperation<unknown>>
   ): T & UpdateRelationOperation<T> & {
      relations?: Record<RelationKeys, NestedRelationOperation<unknown>>;
   } {
      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, unknown> = {};

      // Extraire les relations des attributs - style plus simple comme dans createEntity
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
         relations?: Record<RelationKeys, NestedRelationOperation<unknown>>;
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

   // Les autres méthodes restent inchangées
   public attach(key: string | number): AttachRelationOperation {
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

   public detach(key: string | number): DetachRelationOperation {
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
}



