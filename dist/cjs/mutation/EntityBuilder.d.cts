import { BuildOnly, CreateEntityAttributes, MutationFunction, MutationRequest, MutationResponse, ValidCreateNestedRelation, ValidUpdateNestedRelation } from './types/mutation.cjs';
import { IEntityBuilder } from './interface/IEntityBuilder.cjs';
import { IRelationBuilder } from './interface/IRelationBuilder.cjs';
import { RequestConfig } from '../http/types/http.cjs';
import { RelationBuilder } from './RelationBuilder.cjs';
export declare class EntityBuilder<TModel> extends RelationBuilder implements IEntityBuilder<TModel>, BuildOnly<TModel> {
    private operations;
    private mutationFn;
    private relationBuilder;
    constructor(relationBuilder: IRelationBuilder);
    private extractOperationData;
    setMutationFunction(fn: MutationFunction): void;
    createEntity<T extends Record<string, unknown>, TRelationKeys extends keyof T = never>(attributes: CreateEntityAttributes<T, TRelationKeys>): BuildOnly<TModel, Pick<T, Extract<TRelationKeys, string>>>;
    updateEntity<T extends Record<string, unknown>>(key: string | number, attributes: T): IEntityBuilder<TModel>;
    build(): MutationRequest<TModel, any>;
    mutate(options?: Partial<RequestConfig>): Promise<MutationResponse>;
    createRelation<T extends Record<string, unknown>, TRelationKeys extends keyof T = never>(attributes: T, relations?: Record<TRelationKeys, ValidCreateNestedRelation<unknown>>): T & import('./types/mutation.cjs').CreateRelationOperation<T> & {
        relations?: Record<TRelationKeys, ValidCreateNestedRelation<unknown>> | undefined;
    };
    updateRelation<T extends Record<string, unknown>, TRelationKeys extends keyof T = never>(key: string | number, attributes: T, relations?: Record<TRelationKeys, ValidUpdateNestedRelation<unknown>>): T & import('./types/mutation.cjs').UpdateRelationOperation<T> & {
        relations?: Record<TRelationKeys, ValidUpdateNestedRelation<unknown>> | undefined;
    };
    attach(key: string | number): import('./types/mutation.cjs').AttachRelationDefinition;
    detach(key: string | number): import('./types/mutation.cjs').DetachRelationDefinition;
    sync<T>(key: string | number | Array<string | number>, attributes?: T, pivot?: Record<string, string | number>, withoutDetaching?: boolean): import('./types/mutation.cjs').SyncRelationDefinition<T>;
    toggle<T>(key: string | number | Array<string | number>, attributes?: T, pivot?: Record<string, string | number>): import('./types/mutation.cjs').ToggleRelationDefinition<T>;
}
