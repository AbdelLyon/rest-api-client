import { Attributes, AttachRelationDefinition, CreateRelationOperation, CreateRelationParams, DetachRelationDefinition, IUpdateRelation, SimpleKey, SyncParams, SyncRelationDefinition, ToggleParams, ToggleRelationDefinition, UpdateRelationOperation, UpdateRelationParams } from '../types.js';
export declare class UpdateRelation implements IUpdateRelation {
    add<T extends Attributes, TRelationKey extends keyof T = never>(params: CreateRelationParams<T, TRelationKey>): CreateRelationOperation<T>;
    edit<T extends Attributes, TRelationKey extends keyof T = never>(params: UpdateRelationParams<T, TRelationKey>): UpdateRelationOperation<T>;
    attach(key: SimpleKey): AttachRelationDefinition;
    detach(key: SimpleKey): DetachRelationDefinition;
    sync<T>(params: SyncParams<T>): SyncRelationDefinition<T>;
    toggle<T>(params: ToggleParams<T>): ToggleRelationDefinition<T>;
    private defineRelationDefinition;
}
