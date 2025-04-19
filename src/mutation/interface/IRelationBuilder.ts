import { AttachRelationDefinition, CreateRelationOperation, DetachRelationDefinition, SyncRelationDefinition, ToggleRelationDefinition, UpdateRelationOperation, ValidCreateNestedRelation, ValidUpdateNestedRelation } from "@/mutation/types/mutation";

export interface IRelationBuilder {
   createRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
      attributes: T,
      relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>
   ): T & CreateRelationOperation<T> & {
      relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>;
   };

   updateRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(
      key: string | number,
      attributes: T,
      relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>
   ): T & UpdateRelationOperation<T> & {
      relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>;
   };

   attach(key: string | number): AttachRelationDefinition;
   detach(key: string | number): DetachRelationDefinition;

   sync<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>,
      withoutDetaching?: boolean
   ): SyncRelationDefinition<T>;

   toggle<T>(
      key: string | number | Array<string | number>,
      attributes?: T,
      pivot?: Record<string, string | number>
   ): ToggleRelationDefinition<T>;
}
