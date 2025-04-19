import { IRelationBuilder } from './interface/IRelationBuilder.js';
import { IEntityBuilder } from './interface/IEntityBuilder.js';
export declare class Builder {
    private static relationInstance;
    static getRelationBuilder(): IRelationBuilder;
    static createEntityBuilder<T>(relationBuilder?: IRelationBuilder): IEntityBuilder<T>;
}
