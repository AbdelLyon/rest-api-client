
import {
   AttachRelationDefinition,
   DetachRelationDefinition,
   SyncRelationDefinition,
   ToggleRelationDefinition,
   IRelationBuilder,
   RelationDefinition
} from "@/types/mutate";


export class BaseBuilder implements IRelationBuilder {

   public createRelation<T, R = unknown>(
      attributes: T,
      relations?: Record<string, RelationDefinition<R, unknown>>
   ): T & {
      operation: "create";
      attributes: T;
      relations?: Record<string, RelationDefinition<R, unknown>>;
      __relationDefinition?: true;
   } {
      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, RelationDefinition<R, unknown>> = {};

      if (!relations && attributes && typeof attributes === 'object') {
         for (const [key, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (value && typeof value === 'object' && 'operation' in value) {
               nestedRelations[key] = value as RelationDefinition<R, unknown>;
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
         operation: "create",
         attributes: normalAttributes as T,
         ...(relations ? { relations } : (Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {})),
         __relationDefinition: true
      } as T & {
         operation: "create";
         attributes: T;
         relations?: Record<string, RelationDefinition<R, unknown>>;
         __relationDefinition?: true;
      };

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
      relations?: Record<string, RelationDefinition<R, unknown>>
   ): T & {
      operation: "update";
      key: string | number;
      attributes: T;
      relations?: Record<string, RelationDefinition<R, unknown>>;
      __relationDefinition?: true;
   } {

      const normalAttributes: Record<string, unknown> = {};
      const nestedRelations: Record<string, RelationDefinition<R, unknown>> = {};

      if (!relations && attributes && typeof attributes === 'object') {
         for (const [attrKey, value] of Object.entries(attributes as Record<string, unknown>)) {
            if (value && typeof value === 'object' && 'operation' in value) {
               nestedRelations[attrKey] = value as RelationDefinition<R, unknown>;
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
         operation: "update",
         key,
         attributes: normalAttributes as T,
         ...(relations ? { relations } : (Object.keys(nestedRelations).length > 0 ? { relations: nestedRelations } : {})),
         __relationDefinition: true
      } as T & {
         operation: "update";
         key: string | number;
         attributes: T;
         relations?: Record<string, RelationDefinition<R, unknown>>;
         __relationDefinition?: true;
      };

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
}



