import type { IEntityBuilder, IRelationBuilder } from "../types";
import { EntityBuilder } from "@/mutation/common/EntityBuilder";
import { RelationBuilder } from "@/mutation/common/RelationBuilder";

export class Builder {
  private static relationInstance: IRelationBuilder = new RelationBuilder();

  public static getRelationBuilder(): IRelationBuilder {
    return Builder.relationInstance;
  }

  public static createEntityBuilder<T>(
    relationBuilder?: IRelationBuilder,
  ): IEntityBuilder<T> {
    return new EntityBuilder<T>(
      relationBuilder || Builder.getRelationBuilder(),
    );
  }
}
