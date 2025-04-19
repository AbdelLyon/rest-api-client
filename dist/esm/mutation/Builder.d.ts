import { IRelationBuilder } from "./types/IRelationBuilder.js";
import { IEntityBuilder } from "./types/IEntityBuilder.js";
export declare class Builder {
  private static relationInstance;
  static getRelationBuilder(): IRelationBuilder;
  static createEntityBuilder<T>(
    relationBuilder?: IRelationBuilder,
  ): IEntityBuilder<T>;
}
