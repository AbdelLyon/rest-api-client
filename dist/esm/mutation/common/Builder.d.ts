import { IEntityBuilder, IRelationBuilder } from "../types.js";
export declare class Builder {
  private static relationInstance;
  static getRelationBuilder(): IRelationBuilder;
  static createEntityBuilder<T>(
    relationBuilder?: IRelationBuilder,
  ): IEntityBuilder<T>;
}
