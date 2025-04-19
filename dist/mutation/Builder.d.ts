import { IRelationBuilder } from './interface/IRelationBuilder';
import { IEntityBuilder } from './interface/IEntityBuilder';
export declare class Builder {
    private static relationInstance;
    static getRelationBuilder(): IRelationBuilder;
    static createEntityBuilder<T>(relationBuilder?: IRelationBuilder): IEntityBuilder<T>;
}
