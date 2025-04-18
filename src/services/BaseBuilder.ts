
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
      const nestedRelations: Record<RelationKeys, NestedRelationOperation<unknown>> =
         (relations ? { ...relations } : {}) as Record<RelationKeys, NestedRelationOperation<unknown>>;

      Object.entries(attributes as Record<string, unknown>)
         .forEach(([key, value]) => {
            const isNestedRelation =
               value !== null &&
               typeof value === 'object' &&
               'operation' in value &&
               ['create', 'update', 'attach', 'detach'].includes((value as { operation: string; }).operation);

            isNestedRelation
               ? nestedRelations[key as RelationKeys] = value as NestedRelationOperation<unknown>
               : normalAttributes[key] = value;
         });

      const relationDefinition = {
         operation: "create" as const,
         attributes: normalAttributes as T,
         ...(Object.keys(nestedRelations).length ? { relations: nestedRelations } : {})
      } as T & CreateRelationOperation<T> & {
         relations?: Record<RelationKeys, NestedRelationOperation<unknown>>;
      };

      Object.defineProperty(relationDefinition, '__relationDefinition', {
         value: true,
         enumerable: false
      });

      Object.keys(normalAttributes).forEach(key =>
         Object.defineProperty(relationDefinition, key, {
            get: () => normalAttributes[key],
            enumerable: true
         })
      );

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
      const nestedRelations: Record<RelationKeys, NestedRelationOperation<unknown>> =
         (relations ? { ...relations } : {}) as Record<RelationKeys, NestedRelationOperation<unknown>>;

      Object.entries(attributes as Record<string, unknown>)
         .forEach(([attrKey, value]) => {
            const isNestedRelation =
               value !== null &&
               typeof value === 'object' &&
               'operation' in value &&
               ['create', 'attach'].includes((value as { operation: string; }).operation);

            isNestedRelation
               ? nestedRelations[attrKey as RelationKeys] = value as NestedRelationOperation<unknown>
               : normalAttributes[attrKey] = value;
         });

      const relationDefinition = {
         operation: "update" as const,
         key,
         attributes: normalAttributes as T,
         ...(Object.keys(nestedRelations).length ? { relations: nestedRelations } : {})
      } as T & UpdateRelationOperation<T> & {
         relations?: Record<RelationKeys, NestedRelationOperation<unknown>>;
      };

      Object.defineProperty(relationDefinition, '__relationDefinition', { value: true, enumerable: false });
      Object.keys(normalAttributes).forEach(key =>
         Object.defineProperty(relationDefinition, key, {
            get: () => normalAttributes[key],
            enumerable: true
         })
      );

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



