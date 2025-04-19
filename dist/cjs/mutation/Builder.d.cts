import { IRelationBuilder } from './interface/IRelationBuilder.cjs';
import { IEntityBuilder } from './interface/IEntityBuilder.cjs';
export declare class Builder {
    private static relationInstance;
    static getRelationBuilder(): IRelationBuilder;
    static createEntityBuilder<T>(relationBuilder?: IRelationBuilder): IEntityBuilder<T>;
}
