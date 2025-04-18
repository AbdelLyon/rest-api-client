import { IEntityBuilder, IRelationBuilder } from "@/types/mutate";
import { EntityBuilder } from "./EntityBuilder";
import { BaseBuilder } from "./BaseBuilder";

export class Builder {
   private static relationInstance: IRelationBuilder;

   public static getRelationBuilder(): IRelationBuilder {
      if (!Builder.relationInstance) {
         Builder.relationInstance = new BaseBuilder();
      }
      return Builder.relationInstance;
   }

   public static createEntityBuilder<T>(relationBuilder?: IRelationBuilder): IEntityBuilder<T> {
      return new EntityBuilder<T>(relationBuilder || Builder.getRelationBuilder());
   }
}