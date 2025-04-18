
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

   public createRelation<T, R = unknown>(
      attributes: T,
      relations?: Record<string, NestedRelationOperation<R>>
   ): T & CreateRelationOperation<T> & {
      relations?: Record<string, NestedRelationOperation<R>>;
   } {
      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, NestedRelationOperation<R>> = {};

      if (!relations && attributes && typeof attributes === 'object') {
         for (const [key, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (value && typeof value === 'object' && 'operation' in value &&
               (value.operation === 'create' || value.operation === 'attach')) {
               nestedRelations[key] = value as NestedRelationOperation<R>;
            } else {
               normalAttributes[key] = value;
            }
         }
      } else if (attributes && typeof attributes === 'object') {
         for (const [key, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (!(value && typeof value === 'object' && 'operation' in value)) {
               normalAttributes[key] = value;
            }
         }
      }

      const relationDefinition = {
         operation: "create" as const,
         attributes: normalAttributes as T,
         ...(relations ? { relations } : (Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {})),
      } as T & CreateRelationOperation<T> & {
         relations?: Record<string, NestedRelationOperation<R>>;
      };

      // Définir __relationDefinition comme une propriété non-énumérable
      Object.defineProperty(relationDefinition, '__relationDefinition', {
         value: true,
         enumerable: false,
         writable: false,
         configurable: true
      });

      if (attributes && typeof attributes === 'object') {
         for (const key of Object.keys(normalAttributes)) {
            Object.defineProperty(relationDefinition, key, {
               get() {
                  return normalAttributes[key];
               },
               enumerable: true
            });
         }
      }

      return relationDefinition;
   }

   public updateRelation<T, R = unknown>(
      key: string | number,
      attributes: T,
      relations?: Record<string, NestedRelationOperation<R>>
   ): T & UpdateRelationOperation<T> & {
      relations?: Record<string, NestedRelationOperation<R>>;
   } {

      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, NestedRelationOperation<R>> = {};

      if (!relations && attributes && typeof attributes === 'object') {
         for (const [attrKey, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (value && typeof value === 'object' && 'operation' in value &&
               (value.operation === 'create' || value.operation === 'attach')) {
               nestedRelations[attrKey] = value as NestedRelationOperation<R>;
            } else {
               normalAttributes[attrKey] = value;
            }
         }
      } else if (attributes && typeof attributes === 'object') {
         for (const [attrKey, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (!(value && typeof value === 'object' && 'operation' in value)) {
               normalAttributes[attrKey] = value;
            }
         }
      }

      const relationDefinition = {
         operation: "update" as const,
         key,
         attributes: normalAttributes as T,
         ...(relations ? { relations } : (Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {})),
      } as T & UpdateRelationOperation<T> & {
         relations?: Record<string, NestedRelationOperation<R>>;
      };

      // Définir __relationDefinition comme propriété non-énumérable
      Object.defineProperty(relationDefinition, '__relationDefinition', {
         value: true,
         enumerable: false,
         writable: false,
         configurable: true
      });

      if (attributes && typeof attributes === 'object') {
         for (const key of Object.keys(normalAttributes)) {
            Object.defineProperty(relationDefinition, key, {
               get() {
                  return normalAttributes[key];
               },
               enumerable: true
            });
         }
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



