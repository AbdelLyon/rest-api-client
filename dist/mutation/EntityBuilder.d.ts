import { BuildOnly, MutationFunction, MutationRequest, ValidCreateNestedRelation, ValidUpdateNestedRelation, CreateEntityAttributes, MutationResponse } from './types/mutation';
import { IEntityBuilder } from './interface/IEntityBuilder';
import { IRelationBuilder } from './interface/IRelationBuilder';
import { RelationBuilder } from './RelationBuilder';
import { RequestConfig } from '../http/types/http';
export declare class EntityBuilder<TModel> extends RelationBuilder implements IEntityBuilder<TModel>, BuildOnly<TModel> {
    private operations;
    private mutationFn;
    private relationBuilder;
    constructor(relationBuilder: IRelationBuilder);
    private extractOperationData;
    setMutationFunction(fn: MutationFunction): void;
    createEntity<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(attributes: CreateEntityAttributes<T, RelationKeys>): BuildOnly<TModel, Pick<T, Extract<RelationKeys, string>>>;
    updateEntity<T extends Record<string, unknown>>(key: string | number, attributes: T): IEntityBuilder<TModel>;
    build(): MutationRequest<TModel, any>;
    mutate(options?: Partial<RequestConfig>): Promise<MutationResponse>;
    createRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(attributes: T, relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>>): T & import('./types/mutation').CreateRelationOperation<T> & {
        relations?: Record<RelationKeys, ValidCreateNestedRelation<unknown>> | undefined;
    };
    updateRelation<T extends Record<string, unknown>, RelationKeys extends keyof T = never>(key: string | number, attributes: T, relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>>): T & import('./types/mutation').UpdateRelationOperation<T> & {
        relations?: Record<RelationKeys, ValidUpdateNestedRelation<unknown>> | undefined;
    };
    attach(key: string | number): import('./types/mutation').AttachRelationDefinition;
    detach(key: string | number): import('./types/mutation').DetachRelationDefinition;
    sync<T>(key: string | number | Array<string | number>, attributes?: T, pivot?: Record<string, string | number>, withoutDetaching?: boolean): import('./types/mutation').SyncRelationDefinition<T>;
    toggle<T>(key: string | number | Array<string | number>, attributes?: T, pivot?: Record<string, string | number>): import('./types/mutation').ToggleRelationDefinition<T>;
}
