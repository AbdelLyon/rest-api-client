import { AttachRelationDefinition, CreateRelationOperation, DetachRelationDefinition, SyncRelationDefinition, ToggleRelationDefinition, UpdateRelationOperation, ValidCreateNestedRelation, ValidUpdateNestedRelation } from './types/mutation.js';
import { IRelationBuilder } from './interface/IRelationBuilder.js';
export declare class RelationBuilder implements IRelationBuilder {
    private defineRelationDefinition;
    private extractNestedRelations;
    private addGetters;
    createRelation<T extends Record<string, unknown>, TRelationKeys extends keyof T = never>(attributes: T, relations?: Record<TRelationKeys, ValidCreateNestedRelation<unknown>>): T & CreateRelationOperation<T> & {
        relations?: Record<TRelationKeys, ValidCreateNestedRelation<unknown>>;
    };
    updateRelation<T extends Record<string, unknown>, TRelationKeys extends keyof T = never>(key: string | number, attributes: T, relations?: Record<TRelationKeys, ValidUpdateNestedRelation<unknown>>): T & UpdateRelationOperation<T> & {
        operation: "update";
        relations?: Record<TRelationKeys, ValidUpdateNestedRelation<unknown>>;
    };
    attach(key: string | number): AttachRelationDefinition;
    detach(key: string | number): DetachRelationDefinition;
    sync<T>(key: string | number | Array<string | number>, attributes?: T, pivot?: Record<string, string | number>, withoutDetaching?: boolean): SyncRelationDefinition<T>;
    toggle<T>(key: string | number | Array<string | number>, attributes?: T, pivot?: Record<string, string | number>): ToggleRelationDefinition<T>;
}
